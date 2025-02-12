export class OrderDto {
  status: string | undefined
  courierId: number | undefined
  customerName: string | undefined
  customerPhone: string | undefined
  comment: string | undefined
  id: number | undefined

  constructor(
    status: string | undefined,
    customerName: string,
    customerPhone: string,
    comment: string,
    id?: number,
    courierId?: number,
  ) {
    this.status = status
    this.courierId = courierId
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
    this.id = id
  }

  static generateRandomOrderDto(): OrderDto {
    return new OrderDto('OPEN', 'David', `485${Math.floor(Math.random() * 10)}`, 'no comment')
  }

  static generateOrderDtoWithoutStatus(): OrderDto {
    return new OrderDto(undefined, 'David', '4852345235', 'no comment')
  }

  static generateEmptyOrderDto(): any {
    return {
      comment: undefined,
      courierId: undefined,
      customerName: undefined,
      customerPhone: undefined,
      id: undefined,
      status: undefined,
    }
  }

  static serializeResponse(json: any): OrderDto {
    return new OrderDto(
      json.status,
      json.customerName,
      json.customerPhone,
      json.comment,
      json.id,
      json.courierId,
    )
  }
}
