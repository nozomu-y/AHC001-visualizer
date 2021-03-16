class Advertisement {
  public index: number;
  public a: number;
  public b: number;
  public c: number;
  public d: number;
  public satisfaction: number;
  public score: number;

  constructor(
    i: number,
    a: number,
    b: number,
    c: number,
    d: number,
    r: number,
    score: number
  ) {
    this.index = i;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.satisfaction = ((c - a) * (d - b)) / r;
    this.score = score;
  }
}

class Requirement {
  public x: number;
  public y: number;
  public r: number;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

class Drawer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ads: Advertisement[] = [];
  private diffs: Advertisement[] = [];
  private requirements: Requirement[] = [];
  private n: number = 0;
  private container: HTMLDivElement;
  private scale: number;
  private diff_text: string = "";
  private selectedFile: FileList;

  constructor(id: string) {
    this.container = document.getElementById(id) as HTMLDivElement;
    this.scale = (this.container.offsetWidth / 10000) as number;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvas.height = 10000 * this.scale;
    this.canvas.width = 10000 * this.scale;

    this.ctx.strokeRect(0, 0, this.canvas.height, this.canvas.width);
    this.container.appendChild(this.canvas);

    let btn_load = document.getElementById("load") as HTMLButtonElement;
    btn_load.addEventListener("click", (e: Event) => this.getInput());
    let btn_init = document.getElementById("init") as HTMLButtonElement;
    btn_init.addEventListener("click", (e: Event) => this.init());
    // let diff_input = document.getElementById("diff") as HTMLInputElement;
    // diff_input.addEventListener("change", this.onFileSelect, false);
    let btn_start = document.getElementById("start") as HTMLButtonElement;
    btn_start.addEventListener("click", (e: Event) => this.start());
    let btn_load_diff = document.getElementById(
      "load_diff"
    ) as HTMLButtonElement;
    btn_load_diff.addEventListener("click", (e: Event) => this.getDiff());
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.width);
    this.ctx.strokeRect(0, 0, this.canvas.height, this.canvas.width);
  }

  draw() {
    for (let i = 0; i < this.n; i++) {
      let ad = this.ads[i];
      this.ctx.fillStyle =
        "rgb(" +
        (Math.min(1, ad.satisfaction) * 255).toString() +
        ",0," +
        (Math.max(1, ad.satisfaction) * 255).toString() +
        ")";
      this.ctx.fillRect(
        ad.a * this.scale,
        ad.b * this.scale,
        (ad.c - ad.a) * this.scale,
        (ad.d - ad.b) * this.scale
      );
      this.ctx.strokeRect(
        ad.a * this.scale,
        ad.b * this.scale,
        (ad.c - ad.a) * this.scale,
        (ad.d - ad.b) * this.scale
      );
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.strokeText(
        (i + 1).toString() +
          "\n(" +
          Math.round(ad.satisfaction * 100).toString() +
          "%)",
        ((ad.a + ad.c) / 2) * this.scale,
        ((ad.b + ad.d) / 2) * this.scale
      );
    }
  }

  getInput() {
    this.requirements = [];
    let inputElement = document.getElementById("input") as HTMLInputElement;
    let input: string = inputElement.value;
    let lines: string[] = input.split("\n");
    let n: number = +lines[0];
    for (let i = 1; i <= n; i++) {
      let line: string = lines[i];
      let coord: string[] = line.split(" ");
      let req: Requirement = new Requirement(+coord[0], +coord[1], +coord[2]);
      this.requirements.push(req);
    }
    console.log("Input complete");
  }

  // getOutput() {
  // this.ads = [];
  // this.n = 0;
  // let outputElement = document.getElementById("output") as HTMLInputElement;
  // let output: string = outputElement.value;
  // let lines: string[] = output.split("\n");
  // for (let line of lines) {
  // let coord: string[] = line.split(" ");
  // let ad: Advertisement = new Advertisement(
  // this.n,
  // +coord[0],
  // +coord[1],
  // +coord[2],
  // +coord[3],
  // this.requirements[this.n].r
  // );
  // this.ads.push(ad);
  // this.n++;
  // }
  // }
  getOutput() {
    this.ads = [];
    this.n = this.requirements.length;
    for (let i = 0; i < this.n; i++) {
      let ad: Advertisement = new Advertisement(
        i,
        this.requirements[i].x,
        this.requirements[i].y,
        this.requirements[i].x + 1,
        this.requirements[i].y + 1,
        this.requirements[i].r,
        0
      );
      this.ads.push(ad);
    }
  }

  async onFileSelect() {
    this.selectedFile = (document.getElementById("diff") as HTMLInputElement)
      .files as FileList;
    if (this.selectedFile.length == 0) {
      alert("File not selected");
    } else if (this.selectedFile.length > 1) {
      alert("Multiple files are selected");
    }
    let file: File = this.selectedFile[0];
    const reader = new FileReader();
    reader.readAsText(file);
    await delay(1000);
    // reader.onload = () => {
    this.diff_text = reader.result.toString().trim();
    console.log(this.diff_text);
    // };
  }

  async getDiff() {
    this.onFileSelect();
    await delay(1000);
    console.log(this.diff_text);
    this.diffs = [];
    let lines: string[] = this.diff_text.split("\n");
    for (let line of lines) {
      let coord: string[] = line.split(" ");
      let ad: Advertisement = new Advertisement(
        +coord[0],
        +coord[1],
        +coord[2],
        +coord[3],
        +coord[4],
        this.requirements[+coord[0]].r,
        +coord[5]
      );
      this.diffs.push(ad);
    }
    alert("file loaded");
  }

  async transition() {
    for (let diff of this.diffs) {
      await delay(0);
      this.ads[diff.index] = diff;
      this.clear();
      this.draw();
      document.getElementById("score").innerText = diff.score.toString();
    }
  }

  init() {
    this.clear();
    this.getOutput();
    this.draw();
    console.log("initialization complete");
  }

  start() {
    this.transition();
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // let drawer = new Drawer("visualizer");
  new Drawer("visualizer");
  // drawer.clear();
  // await delay(1000);
  // drawer.draw();
  // await delay(1000);
  // drawer.clear();
  // await delay(1000);
  // drawer.draw();
}

main();
