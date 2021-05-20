let products = [];
const key = "c0421k1-data";
const defaultPagesize = 10;
const defaultPageindex = 1;

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

function showProduct() {
    let tbproduct = document.getElementById('tbProduct');
    let totalProduct = document.getElementById('totalProduct');
    totalProduct.innerHTML = `${products.length} products`;
    tbproduct.innerHTML = "";
    products.forEach(function (value, index) {
        tbproduct.innerHTML += `
                        <tr id="tr_${index}">
                            <td>${index + 1}</td>
                            <td>${value}</td>
                            <td>
                                <a href="javascript:;" class="btn btn-warning" onclick="edit(${index})">Edit</a>
                                <a href="javascript:;" class="btn btn-success d-none" onclick="update(${index})">Update</a>
                                <a href="javascript:;" class="btn btn-warning d-none" onclick="reset(${index})">Cancel</a>
                                <a href="javascript:;" class="btn btn-danger" onclick='remove(${index})'>Remove</a>
                            </td>
                        </tr>
                        `;
    });
}

function AddProduct() {
    let productName = document.getElementById('product-name').value;
    productName = clearUnnecessaryWhiteSpace(productName);
    if (isNullOrEmpty(productName)) {
        alert('Product name is required.');
        clear();
    }
    else if (isExistProduct(productName, products) != -1) {
        alert(`Product name: ${productName} is exist.`);
    }
    else {
        products.push(productName);
        setLocalStorage(key, products);
        clear();
        showProduct();
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
        showProduct();
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
        window.alert("Product name is required");
    }
    else{
        let pos = isExistProduct(newProducName, products);
        if(pos != -1 && pos != index){
            window.alert(`Product name: ${newProducName} is exits.`);
        }
        else{
            products[index] = newProducName;
            setLocalStorage(key, products)
            showProduct();
        }
    }
}

function buildPaging(pagesize, pageindex){
    let totalPages = Math.ceil(products.length/pagesize);
    let paging = document.getElementById('paging');
    paging.innerHTML = "";
    for(let i=1; i<= totalPages; i++){
        paging.innerHTML += `<li><button class='paging-item ${pageindex == i ? 'active' : ''}' 
                                                onclick="changeIndex(${i})">${i}</button></li>`;
    }
}

function changeIndex(index){
    buildPaging(defaultPagesize, index);
}

function changePagesize(){
    let pagesize = parseInt(document.getElementById('pagesize').value)
    buildPaging(pagesize, defaultPageindex);
}

function documentReady() {
    init();
    showProduct();
    buildPaging(defaultPagesize, defaultPageindex);
}

documentReady();
