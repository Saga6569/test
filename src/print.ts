const getdata = async (url: string) => {
  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      return { status: 'ERROR', value: response.status }
    }
    if (response === undefined) {
      return { status: 'ERROR', value: 'ошибка сети' }
    }
    let json = await response.json()
    return json
  } catch (error) {
    console.log(error)
    return { status: 'ERROR', value: error }
  }
}

export default getdata;