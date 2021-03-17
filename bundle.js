/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (() => {

eval("class Advertisement {\n    constructor(i, a, b, c, d, r, score) {\n        this.index = i;\n        this.a = a;\n        this.b = b;\n        this.c = c;\n        this.d = d;\n        this.satisfaction = ((c - a) * (d - b)) / r;\n        this.score = score;\n    }\n}\nclass Requirement {\n    constructor(x, y, r) {\n        this.x = x;\n        this.y = y;\n        this.r = r;\n    }\n}\nclass Drawer {\n    constructor(id) {\n        this.ads = [];\n        this.diffs = [];\n        this.requirements = [];\n        this.n = 0;\n        this.diff_text = \"\";\n        this.container = document.getElementById(id);\n        this.scale = (this.container.offsetWidth / 10000);\n        this.canvas = document.createElement(\"canvas\");\n        this.ctx = this.canvas.getContext(\"2d\");\n        this.canvas.height = 10000 * this.scale;\n        this.canvas.width = 10000 * this.scale;\n        this.ctx.strokeRect(0, 0, this.canvas.height, this.canvas.width);\n        this.container.appendChild(this.canvas);\n        let btn_load = document.getElementById(\"load\");\n        btn_load.addEventListener(\"click\", (e) => this.getInput());\n        let btn_init = document.getElementById(\"init\");\n        btn_init.addEventListener(\"click\", (e) => this.init());\n        // let diff_input = document.getElementById(\"diff\") as HTMLInputElement;\n        // diff_input.addEventListener(\"change\", this.onFileSelect, false);\n        let btn_start = document.getElementById(\"start\");\n        btn_start.addEventListener(\"click\", (e) => this.start());\n        let btn_load_diff = document.getElementById(\"load_diff\");\n        btn_load_diff.addEventListener(\"click\", (e) => this.getDiff());\n    }\n    clear() {\n        this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.width);\n        this.ctx.strokeRect(0, 0, this.canvas.height, this.canvas.width);\n    }\n    draw() {\n        for (let i = 0; i < this.n; i++) {\n            let ad = this.ads[i];\n            this.ctx.fillStyle =\n                \"rgb(\" +\n                    (Math.min(1, ad.satisfaction) * 255).toString() +\n                    \",0,\" +\n                    (Math.max(1, ad.satisfaction) * 255).toString() +\n                    \")\";\n            this.ctx.fillRect(ad.a * this.scale, ad.b * this.scale, (ad.c - ad.a) * this.scale, (ad.d - ad.b) * this.scale);\n            this.ctx.strokeRect(ad.a * this.scale, ad.b * this.scale, (ad.c - ad.a) * this.scale, (ad.d - ad.b) * this.scale);\n            this.ctx.fillStyle = \"rgb(0,255,0)\";\n            this.ctx.fillRect(this.requirements[i].x * this.scale - (50 * this.scale) / 2, this.requirements[i].y * this.scale - (50 * this.scale) / 2, 50 * this.scale, 50 * this.scale);\n            this.ctx.beginPath();\n            this.ctx.moveTo(this.requirements[i].x * this.scale, this.requirements[i].y * this.scale);\n            this.ctx.lineTo(((ad.c + ad.a) / 2) * this.scale, ((ad.d + ad.b) / 2) * this.scale);\n            this.ctx.stroke();\n            this.ctx.textAlign = \"center\";\n            this.ctx.textBaseline = \"middle\";\n            this.ctx.strokeText((i + 1).toString() +\n                \"\\n(\" +\n                Math.round(ad.satisfaction * 100).toString() +\n                \"%)\", ((ad.a + ad.c) / 2) * this.scale, ((ad.b + ad.d) / 2) * this.scale);\n        }\n    }\n    getInput() {\n        this.requirements = [];\n        let inputElement = document.getElementById(\"input\");\n        let input = inputElement.value;\n        let lines = input.split(\"\\n\");\n        let n = +lines[0];\n        for (let i = 1; i <= n; i++) {\n            let line = lines[i];\n            let coord = line.split(\" \");\n            let req = new Requirement(+coord[0], +coord[1], +coord[2]);\n            this.requirements.push(req);\n        }\n        document.getElementById(\"init\").classList.remove(\"disabled\");\n    }\n    // getOutput() {\n    // this.ads = [];\n    // this.n = 0;\n    // let outputElement = document.getElementById(\"output\") as HTMLInputElement;\n    // let output: string = outputElement.value;\n    // let lines: string[] = output.split(\"\\n\");\n    // for (let line of lines) {\n    // let coord: string[] = line.split(\" \");\n    // let ad: Advertisement = new Advertisement(\n    // this.n,\n    // +coord[0],\n    // +coord[1],\n    // +coord[2],\n    // +coord[3],\n    // this.requirements[this.n].r\n    // );\n    // this.ads.push(ad);\n    // this.n++;\n    // }\n    // }\n    getOutput() {\n        this.ads = [];\n        this.n = this.requirements.length;\n        for (let i = 0; i < this.n; i++) {\n            let ad = new Advertisement(i, this.requirements[i].x, this.requirements[i].y, this.requirements[i].x + 1, this.requirements[i].y + 1, this.requirements[i].r, 0);\n            this.ads.push(ad);\n        }\n    }\n    async onFileSelect() {\n        this.selectedFile = document.getElementById(\"diff\")\n            .files;\n        if (this.selectedFile.length == 0) {\n            alert(\"File not selected\");\n        }\n        else if (this.selectedFile.length > 1) {\n            alert(\"Multiple files are selected\");\n        }\n        let file = this.selectedFile[0];\n        const reader = new FileReader();\n        reader.readAsText(file);\n        await delay(1000);\n        // reader.onload = () => {\n        this.diff_text = reader.result.toString().trim();\n        console.log(this.diff_text);\n        // };\n    }\n    async getDiff() {\n        this.onFileSelect();\n        await delay(1000);\n        console.log(this.diff_text);\n        this.diffs = [];\n        let lines = this.diff_text.split(\"\\n\");\n        for (let line of lines) {\n            let coord = line.split(\" \");\n            let ad = new Advertisement(+coord[0], +coord[1], +coord[2], +coord[3], +coord[4], this.requirements[+coord[0]].r, +coord[5]);\n            this.diffs.push(ad);\n        }\n        document.getElementById(\"start\").classList.remove(\"disabled\");\n    }\n    async transition() {\n        let i = 0;\n        for (let diff of this.diffs) {\n            i++;\n            this.ads[diff.index] = diff;\n            if (i % 100 == 0) {\n                await delay(0);\n                this.clear();\n                this.draw();\n                document.getElementById(\"score\").innerText = diff.score.toString();\n            }\n        }\n    }\n    init() {\n        this.clear();\n        this.getOutput();\n        this.draw();\n        document.getElementById(\"load_diff\").classList.remove(\"disabled\");\n    }\n    start() {\n        this.transition();\n    }\n}\nfunction delay(ms) {\n    return new Promise((resolve) => setTimeout(resolve, ms));\n}\nasync function main() {\n    // let drawer = new Drawer(\"visualizer\");\n    new Drawer(\"visualizer\");\n    // drawer.clear();\n    // await delay(1000);\n    // drawer.draw();\n    // await delay(1000);\n    // drawer.clear();\n    // await delay(1000);\n    // drawer.draw();\n}\nmain();\n\n\n//# sourceURL=webpack://AHC001-visualizer/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	
/******/ })()
;