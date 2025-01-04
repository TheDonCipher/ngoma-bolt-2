import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchFilters, SearchResults } from './interfaces/search.interface';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search<T>(
    index: string,
    query: string,
    filters: SearchFilters,
    page = 1,
    limit = 20,
  ): Promise<SearchResults<T>> {
    const { body } = await this.elasticsearchService.search({
      index,
      body: {
        from: (page - 1) * limit,
        size: limit,
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  fields: ['title', 'description', 'artist.name'],
                  fuzziness: 'AUTO',
                },
              },
              ...this.buildFilters(filters),
            ],
          },
        },
      },
    });

    const hits = body.hits.hits.map((hit: any) => ({
      ...hit._source,
      id: hit._id,
      score: hit._score,
    }));

    return {
      items: hits,
      total: body.hits.total.value,
      page,
      pageSize: limit,
      hasMore: (page * limit) < body.hits.total.value,
    };
  }

  private buildFilters(filters: SearchFilters) {
    const filterClauses = [];

    if (filters.genre?.length) {
      filterClauses.push({
        terms: { genre: filters.genre },
      });
    }

    if (filters.priceRange) {
      filterClauses.push({
        range: {
          price: {
            gte: filters.priceRange.min,
            lte: filters.priceRange.max,
          },
        },
      });
    }

    if (filters.verified !== undefined) {
      filterClauses.push({
        term: { verified: filters.verified },
      });
    }

    return filterClauses;
  }

  async indexDocument(
    index: string,
    id: string,
    document: any,
  ): Promise<void> {
    await this.elasticsearchService.index({
      index,
      id,
      body: document,
    });
  }

  async deleteDocument(
    index: string,
    id: string,
  ): Promise<void> {
    await this.elasticsearchService.delete({
      index,
      id,
    });
  }

  async updateDocument(
    index: string,
    id: string,
    document: any,
  ): Promise<void> {
    await this.elasticsearchService.update({
      index,
      id,
      body: {
        doc: document,
      },
    });
  }
}
