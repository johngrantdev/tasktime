import {
  Controller,
  Get,
  Param,
  Inject,
  Req,
  Post,
  Patch,
  Delete,
  Body,
  Query,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NewItemDto } from './dto/newItem.dto';
import { ApiTags } from '@nestjs/swagger';

import { API_PREFIX } from '../shared/config';
import { ClientProxy } from '@nestjs/microservices';
import { GetItemDto } from './dto/getItem.dto';
import { firstValueFrom } from 'rxjs';
import { CreateItemAncestryDto } from './dto/createItemAncestry.dto';
import { UpdateItemDto } from './dto/updateItem.dto';
import { GetAllItemsDto } from 'tasktime-utils';
import { AuthenticatedRequest } from '../shared/interfaces/authenticatedRequest';

@Controller(`${API_PREFIX}/org/:orgId/project/:projectId/item`)
@ApiTags('item')
export class ItemController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natClient: ClientProxy, // private itemAncestryService: ItemAncestryService
  ) {}

  @Get()
  async getAllItems(@Req() req: AuthenticatedRequest) {
    // : Promise<Item[]>
    return await firstValueFrom(
      this.natClient.send('item.getAllItems', {
        userId: req.user.id,
      } as GetAllItemsDto),
    );
  }

  @Get(':itemId')
  async getItem(
    @Req() req: AuthenticatedRequest,
    @Param('itemId') itemId: GetItemDto,
  ) {
    return await firstValueFrom(
      this.natClient.send('item.getItem', {
        userId: req.user.id,
        itemId: itemId,
      }),
    );
  }

  @Post()
  async createItem(
    @Req() req: AuthenticatedRequest,
    @Param('projectId') projectId: string,
    @Body() newItem: NewItemDto,
  ) {
    return await firstValueFrom(
      this.natClient.send('item.createItem', {
        userId: req.user.id,
        projectId: projectId,
        newItem: newItem,
      }),
    );
  }

  @Patch(':itemId')
  async updateItem(
    @Req() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Body() changes: UpdateItemDto,
  ) {
    return await firstValueFrom(
      this.natClient.send('item.updateItem', {
        userId: req.user.id,
        itemId: itemId,
        changes: changes,
      }),
    );
  }

  @Delete(':itemId')
  async deleteItem(
    @Req() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
  ) {
    return await firstValueFrom(
      this.natClient.send('item.deleteItem', {
        userId: req.user.id,
        itemId: itemId,
      }),
    );
  }

  // Ancestry Related
  @Get(':itemId/descendants')
  async getItemDescendants(
    @Req() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Query('depth') depth?: string,
  ) {
    //: Promise<ItemDescendantsDto>
    return await firstValueFrom(
      this.natClient.send('item.getDescendants', {
        userId: req.user.id,
        itemId: itemId,
        depth: depth ? parseInt(depth, 10) : 5,
      }),
    );
  }

  @Post('relationship')
  async createItemAncestry(
    @Req() req: AuthenticatedRequest,
    @Body() newItem: CreateItemAncestryDto,
  ) {
    //: Promise<ItemAncestry>
    return await firstValueFrom(
      this.natClient.send('item.createAncestry', {
        userId: req.user.id,
        newItem: newItem,
      }),
    );
  }

  @Delete('relationship/:itemAncestryId')
  async deleteItemAncestry(
    @Req() req: AuthenticatedRequest,
    @Param('itemAncestryId') itemAncestryId: string,
  ): Promise<undefined> {
    return await firstValueFrom(
      this.natClient.send('item.deleteAncestry', {
        userId: req.user.id,
        itemAncestryId: itemAncestryId,
      }),
    );
  }
}
