function createForm() {
  const tree = getDataTree();
  const data = treeToData(tree);
  // content 不为数组，直接复制数据
  console.log(data.content, Array.isArray(data.content))
  if(!Array.isArray(data.content)){
    copy(data);
  }else{
    yapiMockContainer.classList.add('yapi-inject-css-form');

    yapiMockContainer.innerHTML = `
      <ul id="yApiForm" class="yapi-inject-css-form-ul">
        <li class="yapi-inject-css-form-item">
          <div class="yapi-inject-css-form-item-label">是否需要分页:</div>
          <div class="yapi-inject-css-form-item-value-radio">
            <span class="yapi-inject-css-form-item-value">
              <input type="radio" id="yApiRadioY" value="Y" checked>是
            </span>
            <span class="yapi-inject-css-form-item-value">
              <input type="radio" id="yApiRadioN" value="N">否
            </span>
          </div>
        </li>
        <li class="yapi-inject-css-form-item">
          <div class="yapi-inject-css-form-item-label">当前页码字段:</div>
          <input id="yApiPageNo" />
        </li>
        <li class="yapi-inject-css-form-item">
          <div class="yapi-inject-css-form-item-label">每页大小字段:</div>
          <input id="yApiPageSize" />
        </li>
        <li class="yapi-inject-css-form-item">
          <div class="yapi-inject-css-form-item-label">总条数字段:</div>
          <input id="yApiTotal" />
        </li>
        <li class="yapi-inject-css-form-item">
          <div class="yapi-inject-css-form-item-label">总页数字段:</div>
          <input id="yApiTotalPage" />
        </li>
        <li class="yapi-inject-css-form-item">
          <div class="yapi-inject-css-form-item-label">默认数据条数:</div>
          <input id="yApiTotalNum" />
        </li>
        <li class="yapi-inject-css-form-submit" id="yApiSubmit">
          复制mock数据
        </li>
      </ul>
    `
  
    addFormEvent();
  }
}


function addFormEvent() {
  // 默认开启分页
  window.YAPI_FORM = {};
  render();

  function prop(dom, name, value) {
    if (value) {
      dom.setAttribute(name, value)
    } else {
      for (let key in dom) {
        if (key === name) {
          dom[key] = undefined;
        }
      }
    }
  }

  function render(bol) {
    prop(yApiPageNo, 'disabled', bol);
    prop(yApiPageSize, 'disabled', bol);
    prop(yApiTotal, 'disabled', bol);
    prop(yApiTotalPage, 'disabled', bol);
    prop(yApiTotalNum, 'disabled', bol);

    const disabled = !bol && (!YAPI_FORM.pageNo || !YAPI_FORM.pageSize);
    window.YAPI_FORM.disabled = disabled;
    if (disabled) {
      yApiSubmit.classList.add('yapi-inject-css-form-submit-disabled')
    } else {
      yApiSubmit.classList.remove('yapi-inject-css-form-submit-disabled')
    }
  }

  yApiRadioY.onchange = (e) => {
    prop(yApiRadioY, 'checked', true);
    prop(yApiRadioN, 'checked');
    render()
  }
  yApiRadioN.onchange = (e) => {
    prop(yApiRadioY, 'checked');
    prop(yApiRadioN, 'checked', true);
    render(true)
  }
  yApiPageNo.oninput = (e) => {
    YAPI_FORM.pageNo = e.target.value.trim();
    render();
  }
  yApiPageSize.oninput = (e) => {
    YAPI_FORM.pageSize = e.target.value.trim();
    render();
  }
  yApiTotal.oninput = (e) => {
    YAPI_FORM.total = e.target.value.trim();
  }
  yApiTotalPage.oninput = (e) => {
    YAPI_FORM.totalPage = e.target.value.trim();
  }
  yApiTotalNum.oninput = (e) => {
    YAPI_FORM.totalNum = e.target.value.trim();
  }

  yApiSubmit.onclick = () => {
    if(YAPI_FORM.disabled){
      alert('当前页码字段，每页大小字段 为必填项！')
    }else{
      const tree = getDataTree();
      const info = {
        form: YAPI_FORM,
        tree: tree
      }
      const infoString = JSON.stringify(info);
      const code = getMockCode(infoString)
      copy(code);

      // 删除 form 展示 button
      yapiMockContainer.innerHTML = '';
      const button = renderCreateButton();
      yapiMockContainer.appendChild(button);
      yapiMockContainer.classList.remove('yapi-inject-css-form')
    }
  }
}
 
function getMockCode (infoString){
  const code = `
    const info = ${infoString};
    info.form.totalPage = info.form.totalPage || 'totalPages';
    info.form.total = info.form.total || 'totalCount';

    const len = info.form.totalNum && !isNaN(+info.form.totalNum) ? + info.form.totalNum : 18;
    function initData(item, index) {
      let data;
      switch (item.type) {
        case 'string':
          data = (item.remark || item.key + '-str-');
          data = index ? data + index : data;
          break;
        case 'boolean':
          data = true;
          break;
        case 'integer':
          if(/(Date|date|Time|time)$/.test(item.key)){
            data = +new Date;
          }else{
            data = parseInt(Math.random() * 100);
          }
          break;
        case 'number':
          if(/(Date|date|Time|time)$/.test(item.key)){
            data = +new Date;
          }else{
            data = parseInt(Math.random() * 100);
          }
          break;
      }
      return data;
    }

    function packObj(list=[], index) {
      const obj = {};
      list.forEach(item => {
        if (/object|\[\]/.test(item.type)) {
          if (item.type === 'object') {
            obj[item.key] = packObj(item.children, index);
          } else {
            const tepType = item.type.split('[]').filter(it => it).map(it => it.trim())[0];
            const list = [];
            if (['string', 'boolean', 'integer', 'number'].includes(tepType)) {
              for (let i = 0; i < len; i++) {
                list.push(initData({ type: tepType, key: item.key }, i));
              }
            } else {
              if (['object'].includes(tepType)) {
                for (let i = 0; i < len; i++) {
                  const obj = packObj(item.children, i);
                  list.push(obj);
                }
              }
            }
            obj[item.key] = list.filter(it => it);
          }
        } else {
          obj[item.key] = initData(item, index);
        }
      });
      return list && obj;
    }

    function treeToData(tree, res = {}) {
      for (let key in tree) {
        if (/object|\[\]/.test(tree[key].type)) {
          if (tree[key].type === 'object') {
            res[key] = packObj(tree[key].children);
          } else {
            const list = [];
            for (let i = 0; i < len; i++) {
              list.push(packObj(tree[key].children, i));
            }
            res[key] = list;
          }
        } else {
          res[key] = initData(tree[key]);
        }
      }
      return res;
    }

    const currentPage = params.currentPage || 1;
    const pageSize = params.pageSize || 10;

    const data = treeToData(info.tree);
    const totalCount = data.content.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    let json = {};
    if(currentPage && pageSize){
      const begin = (currentPage - 1) * pageSize;
      if(begin > data.content.length){
        json = {
          success: false,
          message: '分页参数错误'
        }
      }else{
        data.content = data.content.slice(begin, begin + pageSize);
        json = {
          ...data,
          [info.form.pageNo]: currentPage,
          [info.form.pageSize]: pageSize,
          [info.form.total]: totalCount,
          [info.form.totalPage]: totalPages,
        }
      }
    }

    mockJson = json;
  `

  return code;
}
