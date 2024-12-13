import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { MessagesService } from '../messages.service'

@Injectable()
export class ConversationAccessGuard implements CanActivate {
  constructor(private readonly messagesService: MessagesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const currentUserId = request.user?.id
    const conversationId = request.params?.conversationId

    if (!conversationId || !currentUserId) {
      throw new ForbiddenException('Missing required parameters')
    }

    return this.messagesService.checkConversationAccess(conversationId, currentUserId)
  }
}
