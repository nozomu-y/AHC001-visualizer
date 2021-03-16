class Advertisement {
    constructor(i, a, b, c, d, r, score) {
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
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
}
class Drawer {
    constructor(id) {
        this.ads = [];
        this.diffs = [];
        this.requirements = [];
        this.n = 0;
        this.diff_text = "";
        this.container = document.getElementById(id);
        this.scale = (this.container.offsetWidth / 10000);
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.height = 10000 * this.scale;
        this.canvas.width = 10000 * this.scale;
        this.ctx.strokeRect(0, 0, this.canvas.height, this.canvas.width);
        this.container.appendChild(this.canvas);
        let btn_load = document.getElementById("load");
        btn_load.addEventListener("click", (e) => this.getInput());
        let btn_init = document.getElementById("init");
        btn_init.addEventListener("click", (e) => this.init());
        // let diff_input = document.getElementById("diff") as HTMLInputElement;
        // diff_input.addEventListener("change", this.onFileSelect, false);
        let btn_start = document.getElementById("start");
        btn_start.addEventListener("click", (e) => this.start());
        let btn_load_diff = document.getElementById("load_diff");
        btn_load_diff.addEventListener("click", (e) => this.getDiff());
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
            this.ctx.fillRect(ad.a * this.scale, ad.b * this.scale, (ad.c - ad.a) * this.scale, (ad.d - ad.b) * this.scale);
            this.ctx.strokeRect(ad.a * this.scale, ad.b * this.scale, (ad.c - ad.a) * this.scale, (ad.d - ad.b) * this.scale);
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.strokeText((i + 1).toString() +
                "\n(" +
                Math.round(ad.satisfaction * 100).toString() +
                "%)", ((ad.a + ad.c) / 2) * this.scale, ((ad.b + ad.d) / 2) * this.scale);
        }
    }
    getInput() {
        this.requirements = [];
        let inputElement = document.getElementById("input");
        let input = inputElement.value;
        let lines = input.split("\n");
        let n = +lines[0];
        for (let i = 1; i <= n; i++) {
            let line = lines[i];
            let coord = line.split(" ");
            let req = new Requirement(+coord[0], +coord[1], +coord[2]);
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
            let ad = new Advertisement(i, this.requirements[i].x, this.requirements[i].y, this.requirements[i].x + 1, this.requirements[i].y + 1, this.requirements[i].r, 0);
            this.ads.push(ad);
        }
    }
    async onFileSelect() {
        this.selectedFile = document.getElementById("diff")
            .files;
        if (this.selectedFile.length == 0) {
            alert("File not selected");
        }
        else if (this.selectedFile.length > 1) {
            alert("Multiple files are selected");
        }
        let file = this.selectedFile[0];
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
        let lines = this.diff_text.split("\n");
        for (let line of lines) {
            let coord = line.split(" ");
            let ad = new Advertisement(+coord[0], +coord[1], +coord[2], +coord[3], +coord[4], this.requirements[+coord[0]].r, +coord[5]);
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
function delay(ms) {
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
