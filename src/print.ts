const getdata = async (url: string) => {
    try {
        const response = await fetch(url);
        console.log(response)
        if (response.status !== 200) {
            return response.status
        }
        if (response === undefined) {
            return 'ошибка сети'
        }
        let json = await response.json()
        return json
    } catch (er) {
        return er
    }

}
// console.log(getdata(`https://swapi.dev/api/people/1/`))


export default getdata;