function runCollectionSequentially(fn, collection) {
    console.log('Running function ', fn.name);
    let counter = 0;
    let buffer = [];
    return () =>
        collection.reduce(
            (acc, item, index) => {
                if (buffer.length < 50 && index < usersArr.length - 1) {
                    buffer.push(item);
                    return acc;
                } else {
                    buffer.push(item);
                    let tempBuffer = buffer.slice(0);
                    buffer = [];

                    const getNextPromise = tempBuffer => {
                        console.log(
                            'Starting next batch of length',
                            tempBuffer.length
                        );
                        let currentCounter = counter;
                        counter++;
                        
                        return Promise.all(
                            tempBuffer.map(item => {
                                let start = Date.now(),
                                    now = start;
                                while (now - start < 10) {
                                    now = Date.now();
                                }
                                return fn(item);
                            })
                        )
                            .then(() => {
                                console.log(
                                    'Finished batch',
                                    currentCounter,
                                    ' of',
                                    counter,
                                    '\n'
                                );
                            })
                            .catch(err => console.log(err));
                    };
                    return acc.then(getNextPromise(tempBuffer));
                }
            },

            Promise.resolve('ok')
        );
}
