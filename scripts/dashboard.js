let products = [];

function init() {
    if (window.localStorage.getItem('c0421k1-data') == null) {
        products = ["Sony Xperia", "Samsung Galaxy", "Nokia 6", "Xiaomi Redmi Note 4",
            "Apple iPhone 6S", "Xiaomi Mi 5s Plus", "Apple iPhone 8 Plus",
            "Fujitus F-04E", "Oppo A71", "Apple iPhone X"];
        setLocalStorage("c0421k1-data", products);
    }
    else {
        getLocalStorage();
    }
}

function showProduct() {
    let tbproduct = document.getElementById('tbProduct');
    let totalProduct = document.getElementById('totalProduct');
    totalProduct.innerHTML = `${products.length} products`;
    tbproduct.innerHTML = "";
    products.forEach(function (value, index) {
        tbproduct.innerHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${value}</td>
                            <td>
                                <a href="javascript:;" class="btn btn-warning">Edit</a>
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
    else if(isExistProduct(productName, products)){
        alert(`Product name: ${productName} is exist.`);
    }
    else{
        products.push(productName);
        setLocalStorage("c0421k1-data", products);
        clear();
        showProduct();
    }
}

function clear() {
    document.getElementById('product-name').value = '';
}

function getLocalStorage() {
    products = JSON.parse(window.localStorage.getItem("c0421k1-data"));
}

function setLocalStorage(key, data) {
    data.sort();
    window.localStorage.setItem(key, JSON.stringify(data));
}

function isNullOrEmpty(str) {
    return str == null || str.trim() == "";
}

function isExistProduct(productName, data){
    productName = clearUnnecessaryWhiteSpace(productName);
    return data.find(function(value, index){
                return value.toLowerCase() == productName.toLowerCase();
            }) != null;
}

function clearUnnecessaryWhiteSpace(str){
    return str.trim().replace(/  +/g, ' ');
}

function capitalize(str){
    str = clearUnnecessaryWhiteSpace(str);
    str = str.toLowerCase();
    let i = str.indexOf(' ');
    while(i < str.length){
        if(str[i] == ' '){
            str = str.substring(0, i + 1) + str[i+1].toUpperCase() + str.substring(i+2, str.length);
        }
        i++;
    }
    str = str[0].toUpperCase() + str.substring(1, str.length);
    return str;
}

function remove(index){
    let confirmed = window.confirm('Are you sure to remove this product?');
    if(confirmed){
        products.splice(index,1);
        setLocalStorage("c0421k1-data", products);
        showProduct();
    }
}

function documentReady() {
    init();
    showProduct();
}

documentReady();
