
interface Identifier {
  [key: string]: string | number
}
interface Istate {
  requestStatus: 'progress' | 'successfully' | 'ERROR' | '';
  arrData: Identifier[];
  arrDataKeys: string[]
  darag: any;
};

const load: HTMLElement = document.querySelector('.preloader');

const preloader = (requestStatus: string) => {
  const newClassName = `preloader_${requestStatus}`;
  load.className = newClassName;
}

const getdata = async (url: string) => {
  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      return { status: 'ERROR', value: response.status };
    }
    if (response === undefined) {
      return { status: 'ERROR', value: 'ошибка сети' };
    };
    let json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return { status: 'ERROR', value: error };
  };
};

const dataRequest = async (state: Istate) => {
  const countIni = state.arrData.length + 1 === 17 ? state.arrData.length + 2 : state.arrData.length + 1

  const count = state.arrData.length === 0 ? 5 : state.arrData.length + 1 === 17 ? state.arrData.length + 2 : state.arrData.length + 1

  console.log(countIni, count)
  state.requestStatus = 'progress';
  preloader(state.requestStatus);
  const arrData: Identifier[] = [];
  for (let i = countIni; i <= count; i++) {
    const newUrl = `https://swapi.dev/api/people/${String(i)}/`;
    const res: Identifier = await getdata(newUrl);
    if (res.status === 'ERROR') {
      state.requestStatus = 'ERROR';
      preloader(state.requestStatus);
      return res;
    };

    const keys = Object.keys(res);
    const newDate: Identifier = {};

    keys.forEach((key: string) => {
      if (!Array.isArray(res[key]) && key !== 'homeworld') {
        newDate[key] = res[key];
      };
      newDate.id = String(i);
    });
    state.arrData.push(newDate);
  };
  state.requestStatus = 'successfully';
  preloader(state.requestStatus);
  setTimeout(() => {
    preloader('preloader');
  }, 2000);
  state.arrDataKeys = Object.keys(state.arrData[0]);

  localStorage.setItem("state", JSON.stringify(state));
};

export default dataRequest;
