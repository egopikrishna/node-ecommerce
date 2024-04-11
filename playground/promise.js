const myPromise = new Promise((resolve, reject) => {

    setTimeout(()=>{
        const success = true;

        if(success) {
            resolve("Operation Success");
        } else {
            reject(new Error("Operation Failed"));
        }
    }, 5000);

});

myPromise.then((result)=>{
    console.log(result); // you can do operation if the previous one is success
}).catch((error) => {
    console.error(error); // you can operation if the previous one is failed
});

console.log("Loading...");





