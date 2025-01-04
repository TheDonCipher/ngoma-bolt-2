import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { SearchFilters, SortOption } from './types';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private elasticsearch: ElasticsearchService,
  ) {}

  async search(
    query: string,
    filters: SearchFilters,
    sort: SortOption,
    page = 1,
    limit = 20,
  ) {
    const { category, genre, priceRange, dateRange, tags, verified } = filters;

    // Search in Elasticsearch for better performance
    const searchResults = await this.elasticsearch.search({
      index: category,
      query: {
        bool: {
          must: [
            { multi_match: {
              query,
              fields: ['title', 'description', 'artist.name'],
            }},
            genre && { term: { genre }},
            verified && { term: { verified }},
            tags?.length && { terms: { tags }},
            priceRange && {
              range: {
                price: {
                  gte: priceRange.min,
                  lte: priceRange.max,
                },
              },
            },
            dateRange && {
              range: {
                createdAt: {
                  gte: dateRange.start,
                  lte: dateRange.end,
                },
              },
            },
          ].filter(Boolean),
        },
      },
      sort: [
        { [sort.field]: sort.direction },
      ],
      from: (page - 1) * limit,
      size: limit,
    });

    // Get full data from Prisma
    const ids = searchResults.hits.hits.map(hit => hit._id);
    const items = await this.prisma[category].findMany({
      where: { id: { in: ids }},
      include: this.getIncludes(category),
    });

    return {
      items,
      total: searchResults.hits.total.value,
      page,
      pageSize: limit,
      hasMore: (page * limit) < searchResults.hits.total.value,
    };
  }

  private getIncludes(category: string) {
    switch (category) {
      case 'tracks':
        return {
          artist: true,
          album: true,
        };
      case 'albums':
        return {
          artist: true,
          tracks: true,
        };
      case 'artists':
        return {
          tracks: true,
          albums: true,
        };
      default:
        return {};
    }
  }

  async syncSearchIndex() {
    // Sync database data with Elasticsearch
    const categories = ['tracks', 'albums', 'artists'];
    
    for (const category of categories) {
      const items = await this.prisma[category].findMany({
        include: this.getIncludes(category),
      });

      await this.elasticsearch.bulk(
        items.flatMap(item => [
          { index: { _index: category, _id: item.id }},
          this.transformForSearch(item),
        ])
      );
    }
  }

  private transformForSearch(item: any) {
    // Transform database model to search-friendly format
    return {
      ...item,
      _searchable: [
        item.title,
        item.description,
        item.artist?.name,
        item.genre,
        ...(item.tags || []),
      ].filter(Boolean).join(' '),
    };
  }
}
