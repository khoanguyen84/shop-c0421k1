let products = [];
const key = "c0421k1-data";
const defaultPagesize = 10;
const defaultPageindex = 1;
const success = 200;
const error = 500;
let increment = 1;

class Product
{
    constructor(name, price, quantity, photo)
    {
        this.productId = increment ++;
        this.productName = name,
        this.price = price,
        this.quantity = quantity,
        this.photo = photo
    }
}

function init() {
    if (window.localStorage.getItem('c0421k1-data') == null) {
        let product1 = new Product("Sony Xperia", 2000000, 10, 'images/ip6plus.jpg');
        let product2 = new Product("Samsung Galaxy", 2500000, 20, 'images/ip6plus.jpg');
        let product3 = new Product("Nokia 6", 3000000, 15, 'images/ip6plus.jpg');
        let product4 = new Product("Xiaomi Redmi Note 4", 4700000, 5, 'images/ip6plus.jpg');
        let product5 = new Product("Apple iPhone 6S", 5600000, 11, 'images/ip6plus.jpg');
        // products = ["Sony Xperia", "Samsung Galaxy", "Nokia 6", "Xiaomi Redmi Note 4",
        //     "Apple iPhone 6S", "Xiaomi Mi 5s Plus", "Apple iPhone 8 Plus",
        //     "Fujitus F-04E", "Oppo A71", "Apple iPhone X"];
        products = [product1, product2, product3, product4, product5]
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

let tempProducts = [... products];
increment = tempProducts.length == 0 ? 
                1 : 
                tempProducts.sort(function(p1, p2){
                    return p2.productId - p1.productId;
                })[0].productId;

function showProduct(data, pagesize, pageindex) {
    let tbproduct = document.getElementById('tbProduct');
    let totalProduct = document.getElementById('totalProduct');
    totalProduct.innerHTML = `${data.length} products`;
    tbproduct.innerHTML = "";
    
    let list = data.slice((pageindex - 1)* pagesize, pageindex * pagesize);
    list.forEach(function (product, index) {
        tbproduct.innerHTML += `
                        <tr id="tr_${product.productId}">
                            <td>${product.productId}</td>
                            <td>${product.productName}</td>
                            <td style='text-align:right'>${formatCurrency(product.price)}</td>
                            <td style='text-align:right'>${product.quantity}</td>
                            <td><img src="${product.photo}" width="50px" height="70px"></td>
                            <td>
                                <a href="javascript:;" class="btn btn-warning" onclick="edit(${product.productId})"><i class="fa fa-edit"></i></a>
                                <a href="javascript:;" class="btn btn-success d-none" onclick="update(${product.productId})"><i class="fa fa-save"></i></a>
                                <a href="javascript:;" class="btn btn-warning d-none" onclick="reset(${product.productId})"><i class="fa fa-remove"></i></a>
                                <a href="javascript:;" class="btn btn-danger" onclick='remove(${product.productId})'><i class="fa fa-trash"></i></a>
                            </td>
                        </tr>
                        `;
    });
}

function AddProduct() {
    let productName = document.getElementById('product-name').value;
    let price = parseInt(document.getElementById('price').value);
    let quantity = parseInt(document.getElementById('quantity').value);
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
        let product = new Product(productName, price, quantity, 'images/ip6plus.jpg');
        products.push(product);
        setLocalStorage(key, products);
        clear();
        showProduct(products, defaultPagesize, defaultPageindex);
    }
}

function clear() {
    document.getElementById('product-name').value = '';
    let price = document.getElementById('price').value = 0;
    let quantity = document.getElementById('quantity').value = 0;
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
    return data.findIndex(function (product, index) {
        return product.productName.toLowerCase() == productName.toLowerCase();
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

function remove(id) {
    let confirmed = window.confirm('Are you sure to remove this product?');
    if (confirmed) {
        let index = products.findIndex(function(product, index){
                        return product.productId == id
                    });
        products.splice(index, 1);
        setLocalStorage(key, products);
        showProduct(products, defaultPagesize, defaultPageindex);
        showMessage(success, "Product has been remove successful!");
    }
}

function edit(id){
    let product = findById(id);
    let tr = document.getElementById(`tr_${id}`);
    let tds = tr.children;
    tds[1].innerHTML = `<input class='form-controll' type='text' value='${product.productName}'>`;
    tds[2].innerHTML = `<input class='form-controll w-150' type='number' value='${product.price}'>`;
    tds[3].innerHTML = `<input class='form-controll w-100' type='number' value='${product.quantity}'>`;
    tds[5].children[0].classList.add('d-none');
    tds[5].children[1].classList.remove('d-none');
    tds[5].children[2].classList.remove('d-none');
}

function reset(id){
    let product = findById(id);
    let tr = document.getElementById(`tr_${id}`);
    let tds = tr.children;
    tds[1].innerHTML = `${product.productName}`;
    tds[2].innerHTML = `${formatCurrency(product.price)}`;
    tds[3].innerHTML = `${product.quantity}`;
    tds[5].children[0].classList.remove('d-none');
    tds[5].children[1].classList.add('d-none');
    tds[5].children[2].classList.add('d-none');
}

function update(id){
    let tr = document.getElementById(`tr_${id}`);
    let tds = tr.children;
    let newProducName = tds[1].children[0].value;
    let newPrice = parseInt(tds[2].children[0].value);
    let newQuantity = parseInt(tds[3].children[0].value);
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
            let product = findById(id);
            product.productName = newProducName;
            product.price = newPrice;
            product.quantity = newQuantity;

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
        data = products.filter(function(product, index){
            return product.productName.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
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

function findById(id){
    return products.find(function(product, index){
        return product.productId == id;
    })
}

function formatCurrency(number){
    return number.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}
function documentReady() {
    init();
    showProduct(products, defaultPagesize, defaultPageindex);
    buildPaging(products,defaultPagesize, defaultPageindex);
}

documentReady();

