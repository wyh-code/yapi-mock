// 数组默认填充15条
const len = 15;

function setStyle(dom, style) {
  for (let key in style) {
    dom.style[key] = style[key]
  }
}

function createButton() {
  const button = document.createElement('div');
  button.innerText = '生成 mock 数据'

  const styles = {
    background: 'rgba(0,0,0,.3)',
    padding: '8px 16px',
    lineHeight: 1,
    position: 'fixed',
    right: '20px',
    bottom: '20%',
    zIndex: 99999,
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '6px'
  }

  setStyle(button, styles)
  document.getElementsByTagName('body')[0].appendChild(button)

  button.onclick = createData;
}

function getKeyList(trs) {
  let currentLevel = 0;
  let list = [];
  let keyPath = [];
  for (let i = 0; i < trs.length; i++) {
    let tr = trs[i];
    const className = tr.getAttribute('class').split(' ').filter(it => /^ant-table-row-level-/.test(it))
    const level = +className[0].split('ant-table-row-level-')[1];

    const tds = tr.getElementsByTagName('td');
    const key = tds[0].innerText;
    const type = tds[1].innerText;
    const remark = tds[4].innerText;

    // 层级递减
    if (currentLevel > level) {
      keyPath = keyPath.slice(0, keyPath.length - (currentLevel - level))
    }
    // 层级递增
    if (currentLevel < level) {
      keyPath.push(list[i - 1].key);
    }
    currentLevel = level;
    list.push({
      key,
      type,
      remark,
      keyPath: [...keyPath, key],
      level: currentLevel,
    })
  }
  return list;
}

function arrayToTree(list) {
  const map = {};
  list.forEach(item => map[item.keyPath.join('-')] = item);
  let res = {};
  list.forEach(item => {
    if (item.key) {
      if (item.keyPath.length === 1) {
        res[item.key] = item
      } else {
        try {
          const parent = map[item.keyPath.slice(0, -1).join('-')];
          parent.children = parent.children || [];
          parent.children.push(item)
        } catch (err) {
          console.log(err, '生成数据出错')
        }
      }
    }
  })

  return res;
}

function initData(item, index) {
  console.log(index, '====index==')
  let data;
  switch (item.type) {
    case 'string':
      data = (item.remark || 'string');
      data = index ? `${data}-${index}` : data;
      data = data.slice(-5)
      break;
    case 'boolean':
      // data = [true, false][parseInt(Math.random() * 10 % 2)];
      data = true;
      break;
    case 'integer':
      data = parseInt(Math.random() * 100);
      break;
  }
  return data;
}

function packObj(list, index){
  const obj = {};
  list.forEach(item => {
    if (/object|[]/.test(item.type)){
      if(item.type === 'object'){
        obj[item.key] = packObj(item.children, index)
      }else{
        const tepType = item.type.split('[]').filter(it => it).map(it =>it.trim())[0]
        const list = [];
        if(['string', 'boolean', 'integer'].includes(tepType)){
          for(let i = 0; i < len; i++){
            list.push(initData({ type: tepType }, i))
          }
        }else{
          if(['object'].includes(tepType)){
            for(let i = 0; i < len; i++){
              const obj = packObj(item.children, i)
              list.push(obj)
            }
          }
        }
        obj[item.key] = list;
      }
    }else{
      obj[item.key] = initData(item, index)
    }
  })
  return obj;
}

function treeToData(tree, res = {}) {
  for (let key in tree) {
    if (/object|[]/.test(tree[key].type)) {
      if(tree[key].type === 'object'){
        console.log(tree[key])
        res[key] = packObj(tree[key].children)
      }else{
        const list = [];
        for(let i = 0; i < len; i++){
          list.push(packObj(tree[key].children))
        }
        res[key] = list;
      }
    } else {
      res[key] = initData(tree[key])
    }
  }
  return res;
}

function copy(json) {
  // 创建元素用于复制
  var aux = document.createElement("input");
  // 获取复制内容
  var content = JSON.stringify(json)
  // 设置元素内容
  aux.setAttribute("value", content);
  // 将元素插入页面进行调用
  document.body.appendChild(aux);
  // 复制内容
  aux.select();
  // 将内容复制到剪贴板
  document.execCommand("copy");
  // 删除创建元素
  document.body.removeChild(aux);
  alert("复制成功!");
}

function createData() {
  const tables = document.getElementsByTagName('table');
  const table = tables[tables.length - 1];
  const btns = table.getElementsByClassName('ant-table-row-expand-icon');
  for (let i = 0; i < btns.length; i++) {
    btns[i].click()
  }
  const trs = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  const keyList = getKeyList(trs);
  const tree = arrayToTree(keyList)
  const data = treeToData(tree);
  copy(data)
}

createButton()
