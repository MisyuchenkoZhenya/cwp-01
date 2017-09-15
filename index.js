console.log('Hello World');


const name = process.argv[2];
console.log(`Hello ${name}!!!`);


process.argv.forEach((val) => {
    console.log(`${val}`);
});
