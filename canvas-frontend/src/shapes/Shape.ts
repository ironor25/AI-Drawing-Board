export abstract class ShapeClass {
  id: string
  x: number
  y: number
  stroke: string
  fill: string

  constructor(
    id: string,
    x: number,
    y: number,
    stroke = "white",
    fill = "transparent"
  ) {
    this.id = id
    this.x = x
    this.y = y
    this.stroke = stroke
    this.fill = fill
  }

  abstract type: string
  abstract draw(ctx: CanvasRenderingContext2D): void
}


// export abstract class ShapeClass{
//     x : number;
//     y : number;
//     stroke: string;
//     fill: string;

//     constructor(x:number,y:number,stroke="white",fill="transparent"){
//         this.x = x
//         this.y = y
//         this.stroke = stroke
//         this.fill  = fill

//     }

//     abstract draw(ctx : CanvasRenderingContext2D ): void
// }