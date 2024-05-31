import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() request: Request) {
    return this.ordersService.create({
      ...createOrderDto,
      clientId: request['user'].sub,
    });
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.ordersService.findAll(request['user'].sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request) {
    const order = await this.ordersService.findOne(id, request['user'].sub);
    if (!order) {
      throw new UnauthorizedException(
        'This order was not placed by your account.',
      );
    }
    return;
  }
}
