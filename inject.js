// 数组默认填充15条
// const len = 15;

function renderCreateButton (){
  const button = document.createElement('div');
  button.innerText = '生成 mock 数据';
  button.id = 'yApiCreateButton';
  button.onclick = createForm;

  return button;
}

function createMockDom() {
  const mockContainer = document.createElement('div');
  mockContainer.id = 'yapiMockContainer';
  mockContainer.classList.add('yapi-create-button');
  const button = renderCreateButton();
  mockContainer.appendChild(button);
  document.getElementsByTagName('body')[0].appendChild(mockContainer)
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
    // console.log(i, tr, key)
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
  let res = {};
  if (list) {
    list.forEach(item => map[item.keyPath.join('-')] = item);
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
  }

  return res;
}

// function initData(item, index) {
//   let data;
//   switch (item.type) {
//     case 'string':
//       data = (item.remark || 'string');
//       data = index ? `${data}-${index}` : data;
//       data = data.slice(-5)
//       break;
//     case 'boolean':
//       // data = [true, false][parseInt(Math.random() * 10 % 2)];
//       data = true;
//       break;
//     case 'integer':
//       data = parseInt(Math.random() * 100);
//       break;
//     case 'number':
//       if(/(Date|date|Time|time)$/.test(item.key)){
//         data = +new Date;
//       }else{
//         data = parseInt(Math.random() * 100);
//       }
//       break;
//   }
//   return data;
// }

// function packObj(list, index) {
//   const obj = {};
//   list?.forEach(item => {
//     if (/object|\[\]/.test(item.type)) {
//       if (item.type === 'object') {
//         obj[item.key] = packObj(item.children, index)
//       } else {
//         const tepType = item.type.split('[]').filter(it => it).map(it => it.trim())[0]
//         const list = [];
//         if (['string', 'boolean', 'integer', 'number'].includes(tepType)) {
//           for (let i = 0; i < len; i++) {
//             list.push(initData({ type: tepType, key: item.key }, i))
//           }
//         } else {
//           if (['object'].includes(tepType)) {
//             for (let i = 0; i < len; i++) {
//               const obj = packObj(item.children, i)
//               list.push(obj)
//             }
//           }
//         }
//         obj[item.key] = list.filter(it => it);
//       }
//     } else {
//       // console.log(index, 'index===', item)
//       obj[item.key] = initData(item, index)
//     }
//   })
//   return list && obj;
// }

// function treeToData(tree, res = {}) {
//   for (let key in tree) {
//     if (/object|\[\]/.test(tree[key].type)) {
//       if (tree[key].type === 'object') {
//         console.log(tree[key])
//         res[key] = packObj(tree[key].children)
//       } else {
//         const list = [];
//         for (let i = 0; i < len; i++) {
//           // console.log(tree[key].children, '==tree[key].children==')
//           list.push(packObj(tree[key].children, i))
//         }
//         res[key] = list;
//       }
//     } else {
//       res[key] = initData(tree[key])
//     }
//   }
//   return res;
// }

function copy(info) {
  // 创建元素用于复制
  var aux = document.createElement("input");
  // 获取复制内容
  var content = typeof info === 'string' ? info: JSON.stringify(info)
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

function getDataTree() {
  const tables = document.getElementsByTagName('table');
  const table = tables[tables.length - 1];
  const btns = table.getElementsByClassName('ant-table-row-expand-icon');
  for (let i = 0; i < btns.length; i++) {
    btns[i].click()
  }
  const trs = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  const keyList = getKeyList(trs);
  const tree = arrayToTree(keyList);
  // const data = treeToData(tree);
  // copy(data)
  // return data;
  return tree;
}

createMockDom()
