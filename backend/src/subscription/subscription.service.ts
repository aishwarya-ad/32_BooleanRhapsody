import { Injectable } from '@nestjs/common';
import { subscriptionDatabaseService } from 'src/database/services/subscription.service';
import { repositoryBranchSHADatabaseService } from 'src/database/services/repositoryBranchSHA.service';
import { subscription } from 'src/database/schemas/subscription.schema';
import { repositoryBranchSHA } from 'src/database/schemas/repositoryBranchSHA.schema';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { SubscribableOrPromise } from 'rxjs';

@Injectable()
export class SubscriptionService {
  constructor(
    private subService: subscriptionDatabaseService,
    private repoSHAService: repositoryBranchSHADatabaseService,
    private redisService: RedisCacheService,
  ) {}

  async createSubscription(subObj: subscription): Promise<subscription> {
    this.repoSHAService.createRepositorySHA({
      repository: subObj.repository,
      branch: subObj.branch,
      SHA: '',
    });
    this.redisService.setValue(subObj.repository, subObj.branch, ' ');
    return this.subService.createSubscription(subObj);
  }

  async getUniqueRepositories(): Promise<repositoryBranchSHA[]> {
    return this.repoSHAService.getUniqueRepositories();
  }

  async getUsersSubscribedToRepository(
    repoLink: string,
  ): Promise<subscription[]> {
    return this.getUsersSubscribedToRepository(repoLink);
  }

  async getAllSubscription(): Promise<subscription[]> {
    return await this.subService.getAllSubscriptions();
  }

  async getUserReposAndBranches(email: string): Promise<subscription[]> {
    console.log(await this.subService.getUsersRepositoryAndBranches(email));
    return await this.subService.getUsersRepositoryAndBranches(email);
  }

  async deleteSubscription(email: string, repository: string, branch: string) {
    return await this.subService.unsubscribe(email, repository, branch);
  }
}
