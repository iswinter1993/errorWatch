const Koa = require("koa"); // 引入koa
const fs = require("fs");
const _ = require("lodash");
const Router = require("koa-router"); // 引入koa-router
const koaBody = require("koa-body");
const GitInfo = require("./gitlog");
// 解析request的body的功能(post请求)
const bodyParser = require("koa-bodyparser");
const sourceMap = require("source-map"); // mozilla/source-map库
async function querySourceMapPos(errorPos) {
    var readDir = fs.readdirSync("./dist");
  const umiMap = readDir.filter(
    (file) => file.includes(errorPos.fileName) && file.includes(".map")
  );
  console.log("readDir: ", umiMap);
  const rawSourceMap = JSON.parse(
    // 打包后的sourceMap文件
    fs.readFileSync("./dist/" + umiMap[0]).toString()
  );
  const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap); // 获取sourceMap consumer，我们可以通过传入打包后的代码位置来查询源代码的位置
  console.log("获取sourceMap:", consumer.sources);
  console.log("line:", errorPos.row);
  console.log("column:", errorPos.col);
  const originalPosition = consumer.originalPositionFor({
    // 获取 出错代码 在 哪一个源文件及其对应位置
    line: errorPos.row,
    column: errorPos.col,
  });
  // { source: 'webpack:///src/index.js', line: 4, column: 14, name: 'a' }
  console.log("获取 出错代码源文件及其对应位置:", originalPosition);
  // 根据源文件名寻找对应源文件
  const sourceIndex = consumer.sources.findIndex(
    (item) => item === originalPosition.source
  );
  const sourceContent = consumer.sourcesContent[sourceIndex];
//   console.log("根据源文件名寻找对应源文件:", sourceIndex);
  const contentRowArr = sourceContent.split("\n"); //切分
  // [
  //  'const moudleA = require("./moduleA");\r',
  //  '\r',
  //  'if (true) {\r',
  //  '  console.log(a);\r',
  //  '}\r',
  //  ''
  // ]

  // 接下来根据行和列可获取更加具体的位置
  console.log("异常代码：", contentRowArr);
  const sourceCode = JSON.parse(
    JSON.stringify(
      contentRowArr[originalPosition.line - 3] +
        "\n" +
        contentRowArr[originalPosition.line - 2] +
        "\n" +
        contentRowArr[originalPosition.line - 1] +
        "\n" +
        contentRowArr[originalPosition.line] +
        "\n" +
        contentRowArr[originalPosition.line + 1]
    )
  );
  const page = originalPosition.source.replace("webpack://", "");
  consumer.destroy(); // 使用完后记得destroy
  return {
    page,
    sourceCode,
    line: originalPosition.line,
    column: originalPosition.column,
  };
}

const app = new Koa();
const cors = require("koa2-cors");
app.use(cors());
app.use(bodyParser());
const router = new Router();


const initstatus = (v) => {
    v.map(e=>{
        if(e.status) return
        e.status = 'open'
    })
    return v
}

let errorData = {
  jsError: [],
  sourceError: [],
  promiseError: [],
};

let Navigator = {
  ios: [],
  Android: [],
};

let performanceData = {
  cls: {},
  fid: {},
  lcp: {},
};
router.get("/getError", async (ctx) => {
    ctx.body = {
        state: "success",
        errorData,
      };
})
router.get("/getErrorlist", async (ctx) => {
    const errordata = [...errorData.jsError,...errorData.sourceError,...errorData.promiseError]
    const grounpArr = _.groupBy(errordata,'errorKey') || {}
    console.log('grounpArr', grounpArr)
    let newArr = []
    if(errordata.length>0){
        _.map(grounpArr,(v)=>{
            const sortBydata = _.sortBy(v,'time')
            const lastdata = _.last(sortBydata)
            const obj = {...lastdata,count:sortBydata.length}
            newArr.push(obj)
        })
    }
    const rb = ctx.request.query
    
    console.log('rb===============>', rb)
    if(rb.errorKey) newArr = newArr.filter(v=>v.errorKey === rb.errorKey)
    if(rb.errorType) newArr = newArr.filter(v=>v.errorType === rb.errorType)
    if(rb.filename) newArr = newArr.filter(v=>v?.errorPosttion?.page.includes(rb.filename))
    if(rb.status === 'open' || rb.status === 'close' || rb.status === 'Processing') newArr = newArr.filter(v=>v.status === rb.status)

    const pageData = _.chunk(newArr,5)
  ctx.body = {
    state: "success",
    errorData:pageData[rb.current - 1],
    total:newArr.length
  };
});
router.get("/getNavigator", async (ctx) => {
  ctx.body = {
    state: "success",
    Navigator,
  };
});

router.get("/getPerformance", async (ctx) => {
  ctx.body = {
    state: "success",
    performanceData,
  };
});

router.post('/queryDetails', async (ctx) => {
    const errordata = [...errorData.jsError,...errorData.sourceError,...errorData.promiseError]
    const grounpArr = _.groupBy(errordata,'errorKey') || {}
    const rb = ctx.request.body;
   
    const details = grounpArr[rb.errorKey]|| []
    const sortBydata = _.sortBy(details,'time')
    const lastdata = _.last(sortBydata)
    let gitInfo;
    if(lastdata.errorPosttion) {
        gitInfo =await GitInfo.getGitInfo(lastdata.errorPosttion.page.replace('/',''))
    }
    ctx.body = {
        state: "success",
        data:details,
        gitInfo
    };
})


router.post('/changeStatus', async (ctx) => {
    const rb = ctx.request.body;
    const errortype = errorData[rb.type]||[]
    errortype.map(e=>{
        if(e.errorKey === rb.errorKey){
            e.status = rb.status
        }
    })
    errorData[rb.type] = errortype
    ctx.body = {
        state: "success",
    };
})

//接受数据
router.post("/collectionNavigator", async (ctx) => {
  // console.log('send error',ctx)
  const rb = ctx.request.body;
  Navigator[rb.type].push(rb);
  ctx.body = {
    state: "success",
    Navigator,
  };
});
router.post("/sendError", async (ctx) => {
  // console.log('send error',ctx)
  const rb = ctx.request.body;
  errorData[rb.errorType].push(rb);
  if (rb.errorType === "jsError") {
    const { jsError } = errorData;
    jsError.map(async (v) => {
      if (v["errorPosttion"]) return;
      const pos = await querySourceMapPos(v);
      v["errorPosttion"] = pos;
    });
    errorData.jsError = initstatus(jsError);
  }
  errorData.sourceError = initstatus(errorData.sourceError)
  errorData.promiseError = initstatus(errorData.promiseError)
  ctx.body = {
    state: "success",
  };
});

router.post("/performance", async (ctx) => {
  const rb = ctx.request.body;
  performanceData[rb.type] = rb;
  ctx.body = {
    state: "success",
    performanceData,
  };
});

app.use(router.routes()).use(router.allowedMethods()).use(koaBody());

// 启动服务监听本地3000端口
app.listen(3000, () => {
  console.log("应用已经启动，http://localhost:3000");
});
