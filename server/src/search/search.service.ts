import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(ArticleRepository)
    private articleRepository: ArticleRepository,
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
    @InjectRepository(ArticleToTagRepository)
    private articleToTagRepository: ArticleToTagRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ){}
  
  async searchArticle(tag: string, page: number): Promise<Article|any> {
    try {
      console.log(`tag ===${tag} page ===${page}`);
      let limit: number = 9;
      let offset: number = (page - 1) * 9;
      const tagId = await this.tagRepository.getTagId(tag);

      if(!tagId) {
        throw new NotFoundException('cannot find articles');
      }
      const articleIds = await this.articleToTagRepository.getArticleIds(tagId);

      if(!articleIds.length) {
        throw new NotFoundException('cannot find articles');
      }

      const articles = await this.articleRepository.searchArticle(articleIds, limit, offset);
      console.log(`받아온 게시물 갯수는 ${articles.length}개 입니다.`);
      if(!articles.length) throw new NotFoundException('cannot find articles')
      // // 각 게시물에 태그 이름(배열) 추가
      let newArticles = [];
      for(const article of articles) {
          const userId: number = await this.articleRepository.getUserId(article.id);
          const writer: string = await this.userRepository.getUsername(userId);
          const tagIds: object = await this.articleToTagRepository.getTagIds(article.id);
          const tagNames: string[] = await this.tagRepository.getTagNameWithIds(tagIds);
          article.tags = tagNames;
  
          interface articleObject {
              id: string,
              thumbnail: string,
              nickname: string
              totalLike: number,
              totalComment: number,
              tags: string[]
          }
          let creation: articleObject = {
              id: article.id,
              thumbnail: article.thumbnail,
              nickname: writer,
              totalLike: article.totalLike,
              totalComment: article.totalComment,
              tags: article.tags
          };
          newArticles.push(creation);
      }
      return {
          data: {
              articles: newArticles
          },
          message: "ok"
      }
  } catch (err) {
      throw new NotFoundException("No Content")
  }
  }
}
