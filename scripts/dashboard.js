let products = [];
const key = "c0421k1-data";
const defaultPagesize = 10;
const defaultPageindex = 1;
const success = 200;
const error = 500;

function init() {
    if (window.localStorage.getItem('c0421k1-data') == null) {
        products = ["Sony Xperia", "Samsung Galaxy", "Nokia 6", "Xiaomi Redmi Note 4",
            "Apple iPhone 6S", "Xiaomi Mi 5s Plus", "Apple iPhone 8 Plus",
            "Fujitus F-04E", "Oppo A71", "Apple iPhone X"];
        setLocalStorage(key, products);
    }
    else {
        getLocalStorage();
        //if products is empty then remove key from localstorage
        // if(products.length == 0){
        //     window.localStorage.removeItem('c0421k1-data');
        //     window.location.href = 'http://127.0.0.1:5500/';
        // }
    }
}

function showProduct(data, pagesize, pageindex) {
    let tbproduct = document.getElementById('tbProduct');
    let totalProduct = document.getElementById('totalProduct');
    totalProduct.innerHTML = `${data.length} products`;
    tbproduct.innerHTML = "";
    
    let list = data.slice((pageindex - 1)* pagesize, pageindex * pagesize);
    list.forEach(function (value, index) {
        tbproduct.innerHTML += `
                        <tr id="tr_${index}">
                            <td>${index + 1}</td>
                            <td>${value}</td>
                            <td>
                                <a href="javascript:;" class="btn btn-warning" onclick="edit(${index})"><i class="fa fa-edit"></i></a>
                                <a href="javascript:;" class="btn btn-success d-none" onclick="update(${index})"><i class="fa fa-save"></i></a>
                                <a href="javascript:;" class="btn btn-warning d-none" onclick="reset(${index})"><i class="fa fa-remove"></i></a>
                                <a href="javascript:;" class="btn btn-danger" onclick='remove(${index})'><i class="fa fa-trash"></i></a>
                            </td>
                        </tr>
                        `;
    });
}

function AddProduct() {
    let productName = document.getElementById('product-name').value;
    productName = clearUnnecessaryWhiteSpace(productName);
    if (isNullOrEmpty(productName)) {
        // alert('Product name is required.');
        showMessage(error, 'Product name is required.');
        clear();
    }
    else if (isExistProduct(productName, products) != -1) {
        alert(`Product name: ${productName} is exist.`);
    }
    else {
        products.push(productName);
        setLocalStorage(key, products);
        clear();
        showProduct(products, defaultPagesize, defaultPageindex);
    }
}

function clear() {
    document.getElementById('product-name').value = '';
}

function getLocalStorage() {
    products = JSON.parse(window.localStorage.getItem(key));
}

function setLocalStorage(key, data) {
    data.sort();
    window.localStorage.setItem(key, JSON.stringify(data));
}

function isNullOrEmpty(str) {
    return str == null || str.trim() == "";
}

function isExistProduct(productName, data) {
    productName = clearUnnecessaryWhiteSpace(productName);
    return data.findIndex(function (value, index) {
        return value.toLowerCase() == productName.toLowerCase();
    });
}

function clearUnnecessaryWhiteSpace(str) {
    return str.trim().replace(/  +/g, ' ');
}

function capitalize(str) {
    str = clearUnnecessaryWhiteSpace(str);
    str = str.toLowerCase();
    let i = str.indexOf(' ');
    while (i < str.length) {
        if (str[i] == ' ') {
            str = str.substring(0, i + 1) + str[i + 1].toUpperCase() + str.substring(i + 2, str.length);
        }
        i++;
    }
    str = str[0].toUpperCase() + str.substring(1, str.length);
    return str;
}

function remove(index) {
    let confirmed = window.confirm('Are you sure to remove this product?');
    if (confirmed) {
        products.splice(index, 1);
        setLocalStorage(key, products);
        showProduct(products, defaultPagesize, defaultPageindex);
        showMessage(success, "Product has been remove successful!");
    }
}

function edit(index){
    let tr = document.getElementById(`tr_${index}`);
    let tds = tr.children;
    tds[1].innerHTML = `<input class='form-controll' type='text' value='${products[index]}'>`;
    tds[2].children[0].classList.add('d-none');
    tds[2].children[1].classList.remove('d-none');
    tds[2].children[2].classList.remove('d-none');
}

function reset(index){
    let tr = document.getElementById(`tr_${index}`);
    let tds = tr.children;
    tds[1].innerHTML = `${products[index]}`;
    tds[2].children[0].classList.remove('d-none');
    tds[2].children[1].classList.add('d-none');
    tds[2].children[2].classList.add('d-none');
}

function update(index){
    let tr = document.getElementById(`tr_${index}`);
    let tds = tr.children;
    let newProducName = tds[1].children[0].value;
    newProducName = clearUnnecessaryWhiteSpace(newProducName);
    if(isNullOrEmpty(newProducName)){
        showMessage(error, "Product name is required");
    }
    else{
        let pos = isExistProduct(newProducName, products);
        if(pos != -1 && pos != index){
            showMessage(error, `Product name: ${newProducName} is exits.`);
        }
        else{
            products[index] = newProducName;
            setLocalStorage(key, products)
            showProduct(products, defaultPagesize, defaultPageindex);
            showMessage(success, `Product has been update successful.`);
        }
    }
}

function buildPaging(products, pagesize, pageindex){
    let totalPages = Math.ceil(products.length/pagesize);
    let paging = document.getElementById('paging');
    paging.innerHTML = "";
    for(let i=1; i<= totalPages; i++){
        paging.innerHTML += `<li><button class='paging-item ${pageindex == i ? 'active' : ''}' 
                                                onclick="changeIndex(${i})">${i}</button></li>`;
    }
}

function changeIndex(index){
    let pagesize = parseInt(document.getElementById('pagesize').value);
    buildPaging(products, pagesize, index);
    showProduct(products, pagesize, index);
}

function changePagesize(){
    let pagesize = parseInt(document.getElementById('pagesize').value);
    buildPaging(products,pagesize, defaultPageindex);
    showProduct(products, pagesize, defaultPageindex);
}

function search(el){
    let data = products;
    let keyword  = el.value;
    if(keyword != null && keyword != ""){
        data = products.filter(function(value, index){
            return value.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
        });
    }
    let pagesize = parseInt(document.getElementById('pagesize').value);
    showProduct(data, pagesize, defaultPageindex);
    buildPaging(data,pagesize, defaultPageindex);
}

function showMessage(type, msg){
    let alert = document.getElementById('alert');
    alert.classList.remove('d-none');
    alert.children[0].classList.remove('success');
    alert.children[0].classList.remove('error');
    alert.children[0].classList.add( type == success ? 'success' : 'error' );
    alert.children[0].children[0].innerHTML = msg;

    autoCloseMessage();
}

function closeMessage(){
    let alert = document.getElementById('alert');
    alert.classList.add('d-none');
}

function autoCloseMessage(){
    setInterval(() => {
        closeMessage();
    }, 7*1000);
}

function documentReady() {
    init();
    showProduct(products, defaultPagesize, defaultPageindex);
    buildPaging(products,defaultPagesize, defaultPageindex);
}

documentReady();
