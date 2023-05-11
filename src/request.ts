
interface IarrData {
  [key: string]: string | number
}
interface Istate {
  requestStatus: 'progress' | 'successfully' | 'ERROR' | '';
  arrData: IarrData[];
  arrDataKeys: string[]
  drag: string;
};

const load: HTMLElement = document.querySelector('.preloader');

const preloader = (requestStatus: string) => {
  const newClassName = `preloader_${requestStatus}`;
  load.className = newClassName;
}

const getData = async (url: string) => {
  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      return { status: 'ERROR', value: response.status };
    }
    if (response === undefined) {
      return { status: 'ERROR', value: 'ошибка сети' };
    };
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return { status: 'ERROR', value: error };
  };
};

const dataRequest = async (state: Istate) => {
  const countIni = state.arrData.length + 1 === 17 ? state.arrData.length + 2 : state.arrData.length + 1;

  const count = state.arrData.length === 0 ? 5 : state.arrData.length + 1 === 17 ? state.arrData.length + 2 : state.arrData.length + 1;

  state.requestStatus = 'progress';
  preloader(state.requestStatus);

  for (let i = countIni; i <= count; i++) {
    const newUrl = `https://swapi.dev/api/people/${String(i)}/`;
    const res: IarrData = await getData(newUrl);
    if (res.status === 'ERROR') {
      state.requestStatus = 'ERROR';
      preloader(state.requestStatus);
      return res;
    };

    const keys = Object.keys(res);
    const newData: IarrData = {};

    keys.forEach((key: string) => {
      if (!Array.isArray(res[key]) && key !== 'homeworld') {
        newData[key] = res[key];
      };
      newData.id = String(i);
    });
    state.arrData.push(newData);
  };
  state.requestStatus = 'successfully';

   preloader('preloader');

  state.arrDataKeys = Object.keys(state.arrData[0]);

  localStorage.setItem("state", JSON.stringify(state));
};

export default dataRequest;
