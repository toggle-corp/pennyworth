export default () => {
    const sampleData = [];
    for (let i = 5; i <= 30; i += 1) {
        sampleData.push({
            amount: (Math.random() * 800) + 100,
            time: new Date(2017, 6, i),
        });
    }
    return sampleData;
};
