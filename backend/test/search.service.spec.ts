import { Test } from '@nestjs/testing';
import { SearchService } from '../src/search/search.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

describe('SearchService', () => {
  let searchService: SearchService;
  let elasticsearchService: ElasticsearchService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: ElasticsearchService,
          useValue: {
            search: jest.fn(),
            index: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    searchService = moduleRef.get<SearchService>(SearchService);
    elasticsearchService = moduleRef.get<ElasticsearchService>(ElasticsearchService);
  });

  describe('search', () => {
    it('should return search results', async () => {
      const mockResponse = {
        body: {
          hits: {
            hits: [
              {
                _source: { title: 'Test Track' },
                _id: '1',
                _score: 1,
              },
            ],
            total: { value: 1 },
          },
        },
      };

      (elasticsearchService.search as jest.Mock).mockResolvedValue(mockResponse);

      const result = await searchService.search('tracks', 'test', {});

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });
});
