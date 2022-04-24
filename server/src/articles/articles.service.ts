import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticleToTag } from './entities/article_tag.entity';
import { Tag } from './entities/tag.entity';
import { TagHits } from './entities/tagHits.entity';
import { ArticleRepository } from './repositories/article.repository';
import { ArticleToTagRepository } from './repositories/article_tag.repository';
import { TagRepository } from './repositories/tag.repository';
import { TagHitsRepository } from './repositories/tagHits.repository';
import { TrackRepository } from './repositories/track.repository';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleRepository)
    private articleRepository: ArticleRepository,
    @InjectRepository(TrackRepository)
    private trackRepository: TrackRepository,
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
    @InjectRepository(ArticleToTagRepository)
    private articleToTagRepository: ArticleToTagRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(FollowRepository)
    private followRepository: FollowRepository,
    @InjectRepository(LikesRepository)
    private likesRepository: LikesRepository,
    @InjectRepository(TagHitsRepository)
    private tagHitsRepository: TagHitsRepository,
  ) {}

  async getMain(user: number, page: number): Promise<object> {
    const getFollowing = await this.followRepository.getFollowingIds(user);
    if (!getFollowing) {
      throw new UnauthorizedException('permisson denied');
    } else if (getFollowing.length === 0) {
      throw new NotFoundException('not found following ids');
    }

    const newArticles = [];
    let limit: number = 9;
    let offset: number = (page - 1) * 9;
    const articles = await this.articleRepository.getArticleInfo(
      getFollowing,
      limit,
      offset,
    );

    if (!articles || articles.length === 0) {
      throw new NotFoundException('not found articles');
    }

    try {
      for (const article of articles) {
        const userId: number = await this.articleRepository.getUserId(
          article.id,
        );
        const writer: string = await this.userRepository.getUsername(userId);
        const profileImage: string = await this.userRepository.getProfileImage(
          userId,
        );
        const tagIds: number[] = await this.articleToTagRepository.getTagIds(
          article.id,
        );
        let tagNames: string[] = [];

        for (const tagId of tagIds) {
          const tagName: string = await this.tagRepository.getTagNameWithIds(
            tagId,
          );
          tagNames.push(tagName);
        }
        article.tags = tagNames;

        interface articleObject {
          id: string;
          userId: number;
          thumbnail: string;
          nickname: string;
          profileImage: string;
          hits: number;
          totalLike: number;
          totalComment: number;
          tags: string[];
        }

        let creation: articleObject = {
          id: article.id,
          userId: userId,
          thumbnail: article.thumbnail,
          nickname: writer,
          profileImage,
          hits: article.hits,
          totalLike: article.totalLike,
          totalComment: article.totalComment,
          tags: article.tags,
        };
        newArticles.push(creation);
      }
      return {
        data: {
          articles: newArticles,
        },
        message: 'ok',
      };
    } catch (err) {
      throw new NotFoundException('not found articles contents');
    }
  }

  async getRecent(page: number): Promise<object> {
    let limit: number = 9;
    let offset: number = (page - 1) * 9;
    const articles = await this.articleRepository.getArticleInfo(
      [],
      limit,
      offset,
    );

    if (!articles || articles.length === 0) {
      throw new NotFoundException('not found articles');
    }

    let newArticles = [];

    try {
      for (const article of articles) {
        const userId: number = await this.articleRepository.getUserId(
          article.id,
        );
        const writer: string = await this.userRepository.getUsername(userId);
        const profileImage: string = await this.userRepository.getProfileImage(
          userId,
        );
        const tagIds: number[] = await this.articleToTagRepository.getTagIds(
          article.id,
        );
        let tagNames: string[] = [];

        for (const tagId of tagIds) {
          const tagName: string = await this.tagRepository.getTagNameWithIds(
            tagId,
          );
          tagNames.push(tagName);
        }
        article.tags = tagNames;

        interface articleObject {
          id: string;
          userId: number;
          thumbnail: string;
          nickname: string;
          profileImage: string;
          hits: number;
          totalLike: number;
          totalComment: number;
          tags: string[];
        }

        let creation: articleObject = {
          id: article.id,
          userId: userId,
          thumbnail: article.thumbnail,
          nickname: writer,
          profileImage,
          hits: article.hits,
          totalLike: article.totalLike,
          totalComment: article.totalComment,
          tags: article.tags,
        };
        newArticles.push(creation);
      }

      return {
        data: {
          articles: newArticles,
        },
        message: 'ok',
      };
    } catch (err) {
      throw new NotFoundException('not found articles contents');
    }
  }

  async findOrCreateTags(
    articleId: number,
    tag: [] | object[],
  ): Promise<string[]> {
    try {
      return await Promise.all(
        tag.map(async (eachTag) => {
          const { tagName, order } = eachTag;
          let tagInfo = await this.tagRepository.findOne({ tagName });

          if (!tagInfo) {
            const newTag: Tag = this.tagRepository.create({ tagName });
            tagInfo = await this.tagRepository.save(newTag);
          }

          const newArticleTag: ArticleToTag =
            this.articleToTagRepository.create({
              tagId: tagInfo.id,
              order,
              articleId,
            });

          await this.articleToTagRepository.save(newArticleTag);
          return tagInfo.tagName;
        }),
      );
    } catch (err) {
      throw new NotFoundException('not found tags');
    }
  }

  async createArticle(createArticleDto: CreateArticleDto): Promise<any> {
    const { user, road, tag, content, thumbnail } = createArticleDto;
    const userInfo = await this.userRepository.findOne({
      where: { id: user },
      select: ['id', 'nickname', 'profileImage'],
    });

    if (!userInfo) {
      throw new NotFoundException(`not found user's information`);
    }

    const articleResult = await this.articleRepository.createArticle(
      user,
      content,
      thumbnail,
    );
    const articleId = articleResult.id;
    try {
      const trackList = await this.trackRepository.createTrack(road, articleId);
      const tagList = await this.findOrCreateTags(articleId, tag);
      return {
        data: {
          userInfo,
          articleInfo: {
            id: articleId,
            totalLike: articleResult.totalLike,
            totalComment: articleResult.totalComment,
            roads: trackList,
            tags: tagList,
            comments: [],
          },
        },
        message: 'article created',
      };
    } catch {
      this.articleRepository.deleteArticle(articleId);
      throw new BadRequestException('bad request');
    }
  }

  async getArticleDetail(id: number, user?: number): Promise<any> {
    const articleInfo = await this.articleRepository.getArticleDetail(id);
    if (!articleInfo)
      throw new NotFoundException(`not found the article's contents`);

    // 게시물 조회 수 증가
    const resultOfAddArticleHits = await this.addArticleHits(id)
    if(!resultOfAddArticleHits) throw new BadRequestException('bad request');

    const userInfo = await this.userRepository.getUserInfo(articleInfo.userId);
    if (!userInfo) throw new NotFoundException(`not found user's information`);

    const likedOrNot = await this.likesRepository.likeOrNot(
      user || undefined,
      id,
    );
    const tagIds = await this.articleToTagRepository.getTagIds(articleInfo.id);
    if (!tagIds || tagIds.length === 0)
      throw new NotFoundException(`not found tags`);
      
    let tagInfo = {};
    Promise.all(
      tagIds.map(async (tagId) => {
        const tagName: string = await this.tagRepository.getTagNameWithIds(tagId);
        tagInfo[tagId] = tagName;
        await this.addTagHits(tagId, tagName);
      })
    ).catch((err) => {
      console.log(err)
      throw new BadRequestException('bad request');
    })


    const roads = await this.trackRepository.getRoads(articleInfo.id);
    if (!roads || roads.length === 0)
      throw new NotFoundException(`not found article's roads`);
    let article = {};
    article = {
      id: articleInfo.id,
      thumbnail: articleInfo.thumbnail,
      content: articleInfo.content,
      totalLike: articleInfo.totalLike,
      totalComment: articleInfo.totalComment,
      likedOrNot: likedOrNot,
      createdAt: articleInfo.createdAt,
      tags: Object.values(tagInfo),
      roads,
    };

    return {
      data: {
        userInfo: {
          id: userInfo.id,
          nickname: userInfo.nickname,
          profileImage: userInfo.profileImage,
        },
        articleInfo: article,
      },
      message: 'ok',
    };
  }

  async updateArticle(updateArticleDto: UpdateArticleDto): Promise<any> {
    const { user, articleId, content, tag } = updateArticleDto;

    const articleInfo = await this.articleRepository.findOne({
      where: { id: articleId },
      select: ['id', 'content', 'totalComment', 'totalLike', 'userId'],
    });
    if (!articleInfo)
      throw new NotFoundException(`not found article's contents`);

    if (user !== articleInfo.userId)
      throw new ForbiddenException('permission denied');

    if (articleInfo.content !== content)
      this.articleRepository.update({ id: articleId }, { content });

    const userInfo = await this.userRepository.findOne({
      where: { id: user },
      select: ['id', 'nickname', 'profileImage'],
    });
    if (!userInfo) {
      this.articleRepository.update(articleId, {content: articleInfo.content});
      throw new NotFoundException('not found user information');
    }

    const lastTags: Array<any> = await this.articleToTagRepository.find({
      where: { articleId },
      select: ['tagId', 'order'],
    });
    if (!lastTags || lastTags.length === 0) {
      this.articleRepository.update(articleId, {
        content: articleInfo.content,
      });
      throw new NotFoundException('not found tags');
    }

    const roads = await this.trackRepository.getRoads(articleId);
    if (!roads || roads.length === 0) {
      this.articleRepository.update(articleId, {content: articleInfo.content});
      throw new NotFoundException(`not found article's roads`);
    }

    const deleteTagsResult = await this.articleToTagRepository.deleteTags(articleId);
    if(!deleteTagsResult || deleteTagsResult.affected === 0) {
      this.articleToTagRepository.deleteTags(articleId)
      this.articleRepository.update(articleId, {content: articleInfo.content});
      lastTags.forEach(({ tagId, order }) => {
        this.articleToTagRepository.save({ tagId, articleId, order });
      });
      throw new BadRequestException('bad request, a task was cancelled');
    }
    
    const findOrCreateTagsResult = await this.findOrCreateTags(articleId, tag);
    if(!findOrCreateTagsResult) {
      this.articleToTagRepository.deleteTags(articleId)
      this.articleRepository.update(articleId, {content: articleInfo.content});
      lastTags.forEach(({ tagId, order }) => {
        this.articleToTagRepository.save({ tagId, articleId, order });
      });
      throw new BadRequestException('bad request, a task was cancelled');
    }
    return {
      data: {
        userInfo,
        articleInfo: {
          ...articleInfo,
          roads,
        },
      },
      message: 'article modified',
    }; 
  }

  async deleteArticle(id: number) {
    const result = await this.articleRepository.deleteArticle(id);
    if (!result) {
      throw new NotFoundException('not found article you wanted to delete');
    } else {
      return {
        message: 'article deleted',
      };
    }
  }

  async addArticleHits(id: number): Promise<boolean> {
    return await this.articleRepository.addArticleHits(id)
  }

  async addTagHits(id: number, tagName: string): Promise<boolean> {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const date = new Date().getDate();
    const today = `${year}/${month}/${date}`;

    const tagHitsId = await this.tagHitsRepository.findId(id, today)
    if(tagHitsId) {
      return await this.tagHitsRepository.addTagHits(tagHitsId);
    } else {
      const createdItem: TagHits = await this.tagHitsRepository.createTagHits(id, tagName)
      return await this.tagHitsRepository.addTagHits(createdItem.id)
    }
  }
  
  async getPopularTag(): Promise<any> {
    const limit = 5;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const date = new Date().getDate();
    const today = `${year}/${month}/${date}`
    const popularTags = await this.tagHitsRepository.getPopularTag(limit, today);
    const defaultTags = [
      {
        tagName: "서울"
      },
      {
        tagName: "부산"
      },
      {
        tagName: "제주도"
      },
      {
        tagName: "나들이"
      },
      {
        tagName: "산책로"
      }

    ]

    if(!popularTags || popularTags.length === 0) {
      return {
        data: {
          popularTags: defaultTags,
        },
        message: 'send default tags'
      }
    } else {
      return {
        data: {
          popularTags
        },
        message: 'success'
      }
    }
  }
}
