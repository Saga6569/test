import * as _ from 'lodash';
import './style.css';
import getdata from './print';

interface Identifier {
  [key: string]: string;
}

interface Istate {
  requestStatus: 'progress' | 'successfully' | 'ERROR' | '';
  arrData: Identifier[];
};

const state: Istate = {
  requestStatus: '',
  arrData: [],
}

const slep = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
};

const container: HTMLElement = document.querySelector('.container');
const buttondDownload: HTMLElement = document.querySelector('.download');
const buttondReset: HTMLElement = document.querySelector('.reset');
const plug: HTMLElement = document.querySelector('.plug');
const load: HTMLElement = document.querySelector('.preloader');

const preloader = () => {

  const newClassName = `preloader_${state.requestStatus}`
  load.className = newClassName;

  setTimeout(() => {
    load.className = 'preloader';
  }, 2000);
}

const dataRequest = async () => {
  state.requestStatus = 'progress'
  preloader();
  const arrData: Identifier[] = [];

  for (let i = 1; i <= 5; i++) {

    const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const newUrl = `https://swapi.dev/api/people/${String(randomNumber(1, 81))}/`;
    const res: Identifier = await getdata(newUrl);

    if (res.status === 'ERROR') {
      state.requestStatus = 'ERROR'
      preloader()
      return res;
    };

    const keys = Object.keys(res);

    const newDate: Identifier = {};

    keys.forEach((key: string) => {
      if (!Array.isArray(res[key]) && key !== 'homeworld') {
        newDate[key] = res[key];
      };
    });
    arrData.push(newDate);
  };

  // await slep()

  state.requestStatus = 'successfully';
  localStorage.setItem("arrData", JSON.stringify(arrData));

  preloader();
  state.arrData = arrData;
}

const onClick = async () => {
  if (state.arrData.length === 0) {
    const request = await dataRequest()
    if (state.requestStatus === 'ERROR') {
      return;
    };
  };

  const arrData = state.arrData;
  const keys = Object.keys(arrData[0]);
  const heder = document.querySelector('.name') as HTMLElement;
  const childHeder = Array.from(heder.children) as HTMLElement[];

  keys.forEach((key: string, i: number) => {
    if (i === 0) {
      return;
    };

    const line = document.querySelector(`.line_${i}`) as HTMLElement;
    const childLine = Array.from(line.children);
    childLine.forEach((line: HTMLElement, j: number) => {
      if (j === 0) {
        line.innerText = key;
        const divDrag = document.createElement('div');
        divDrag.className = 'dragSlider'
        line.append(divDrag)
        return;
      }
      childHeder[j].innerText = arrData[j - 1].name;
      line.innerText = arrData[j - 1][key];
    });
  });

  buttondDownload.setAttribute('disabled', 'false');
  container.style.opacity = '1';
  container.style.transition = '2s';
  buttondReset.style.display = '';
  plug.style.display = 'none';
};

const onClickRes = async (e: Event) => {

  const heder = document.querySelector('.name') as HTMLElement;
  const childHeder = Array.from(heder.children) as HTMLElement[];

  childHeder.forEach((el: HTMLElement, i: number) => {
    el.innerText = i === 0 ? el.innerText : '';
  })

  const arrTr = Array.from(document.querySelectorAll('tr')) as HTMLElement[];
  arrTr.forEach((el: HTMLElement, i: number) => {
    if (i === 0) {
      return;
    }
    Array.from(el.children).forEach((element: HTMLElement, j: number) => {
      if (j === 0) {
        return;
      }
      element.innerText = '';
    });
  });
  buttondDownload.removeAttribute('disabled');
  container.style.opacity = '0'
  buttondReset.style.display = 'none';
  plug.style.display = '';
  localStorage.setItem("arrData", JSON.stringify(null));
  state.arrData = []
};


const dragApp = () => {

  const arrTr: HTMLElement[] = Array.from(document.querySelectorAll('tr'));

  arrTr.forEach((el: HTMLElement) => {
    if (el.className === 'name') {
      return;
    };
    el.addEventListener("dragstart", (event: any) => {
    });
    el.addEventListener("dragenter", (event: any) => {
    });
    el.addEventListener("dragLeave", (event: any) => {
    });
    el.addEventListener("drag", (event: any) => {
    });



  });

};

const app = async () => {
  buttondDownload.addEventListener('click', () => onClick());
  buttondReset.addEventListener('click', onClickRes);

  const localStorageData = JSON.parse(localStorage.getItem('arrData'));

  dragApp();

  if (localStorageData !== null) {
    state.arrData = localStorageData;
    plug.style.display = 'none';
    container.style.opacity = '1';
    container.style.transition = '2s';
    onClick();
    return;
  };

  container.style.opacity = '0';
  container.style.transition = '0s';
  buttondReset.style.display = 'none';

};

app();
