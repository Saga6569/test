import './style.css';
import dataRequest from './request';
import onMouseDragAndDrop from './drag';
import { mouseResizeWidth, mouseResizeHeight } from './resize';

interface IarrData {
  [key: string]: string;
};

interface Istate {
  requestStatus: 'progress' | 'successfully' | 'ERROR' | '';
  arrData: IarrData[];
  arrDataKeys: string[];
  drag: string | any;
  move: boolean;
  style: any;
};

const svg = (text: string) => `${text}<svg class='siz' width="20" height="20">
               <polygon points="20,20 20,0 0,20"
              fill = "violet" stroke = "purple" stroke - width="2"
              />
            </svg>
            `;

const state: Istate = {
  requestStatus: '',
  arrData: [],
  arrDataKeys: [],
  drag: '',
  move: false,
  style: {},
};

const keyNumber = ['id', 'height', 'mass'];
const kyeDate = ['created', 'edited'];

const buttonSort = (el: HTMLElement, key: string) => {
  const button = document.createElement('div');
  button.innerText = '↓';
  button.className = 'buttonSort';

  button.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    if (keyNumber.includes(key)) {
      state.arrData.sort((a: IarrData, b: IarrData) => Number(a[key]) - Number(b[key]));
    } else if (kyeDate.includes(key)) {
      state.arrData.sort((a: IarrData, b: IarrData) => Date.parse(a[key]) - Date.parse(b[key]));
    } else {
      state.arrData.sort((a, b) => {
        if (a[key].toLowerCase() < b[key].toLowerCase()) {
          return -1;
        }
        if (a[key].toLowerCase() < b[key].toLowerCase()) {
          return 1;
        }
        return 0;
      });
    };
    localStorage.setItem("state", JSON.stringify(state));
    render(state);
  });
  el.append(button);
};

const buttonClose = (el: HTMLElement, id: string) => {
  const button = document.createElement('div');
  button.innerText = 'X';
  button.className = 'buttonClose';

  button.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    const newArrData = (state.arrData).filter((el: IarrData) => el.id !== id);
    state.arrData = newArrData;
    localStorage.setItem("state", JSON.stringify(state));
    render(state);
  });
  el.append(button);
};

const reorder = (id: string, state: Istate, idTarget: string) => {
  const arrId: string[] = state.arrData.map((el) => el.id);
  const i = arrId.indexOf(id);

  const iterate = (collection: string[], id: string): any => {
    const indexEl = collection.indexOf((id));
    if (collection[i] === id) {
      return collection;
    }
    if (indexEl < i) {
      const value1 = collection[indexEl + 1];
      const value2 = collection[indexEl];
      collection[indexEl] = value1;
      collection[indexEl + 1] = value2;
      return iterate(collection, idTarget);
    };
    if (indexEl > i) {
      const value1 = collection[indexEl - 1];
      const value2 = collection[indexEl];
      collection[indexEl] = value1;
      collection[indexEl - 1] = value2;
      return iterate(collection, idTarget);
    };
    return collection;
  };
  const newArrId = iterate(arrId, idTarget);
  const newArrEl = newArrId.map((id: string) => {
    const newEl = state.arrData.filter((el) => el.id === id)[0];
    return newEl;
  });
  return newArrEl;
};

const buttondDownload: HTMLElement = document.querySelector('.download');
const buttondReset: HTMLElement = document.querySelector('.reset');
const plug: HTMLElement = document.querySelector('.plug');

const defaltWidthCell = 100;
const defaltHeightCell = 50;

const render = (state: Istate) => {
  console.log(state);

  const container: HTMLElement = document.querySelector('.container');
  document.querySelector('.table')?.remove();
  if (state.arrData.length === 0) {
    plug.style.display = '';
    container.style.display = 'none';
    return;
  };

  const table: HTMLElement = document.createElement('div');
  table.className = 'table';
  document.querySelector('.container').prepend(table);

  container.style.display = '';
  const arrData = state.arrData;
  const keys = state.arrDataKeys;

  const trHeder = document.createElement('tr');
  trHeder.className = 'heder';

  keys.forEach((key: string, i: number) => {
    const th = document.createElement('th');
    const className = `cell_${i}`;
    th.className = className;

    if (!(state.style).hasOwnProperty(className)) {
      state.style[className] = { width: defaltWidthCell, Height: defaltHeightCell };
    };

    const width = state.style[className].width;
    const height = state.style[className].height;

    th.style.width = `${width}px`;
    th.style.height = `${height}px`;
    th.innerHTML = svg(key);
    buttonSort(th, key)

    trHeder.append(th);
    th.querySelector('polygon').addEventListener('mousedown', (e) => mouseResizeWidth(e, state, th, container, render));
  });

  table.append(trHeder);
  arrData.forEach((el: IarrData, i: number) => {
    const trLine = document.createElement('tr');
    const className = `line_${i}`;
    trLine.className = className;

    if (!(state.style).hasOwnProperty(className)) {
      state.style[className] = { height: defaltHeightCell }
    }
    trLine.style.height = `${state.style[className].height}px`;
    keys.forEach((key: string, i: number) => {
      if (key === 'id') {
        trLine.id = el[key];
      };
      const td = document.createElement('td');
      td.className = `cell_${i}`;
      td.innerText = el[key];
      if (i === 0) {
        td.innerHTML = svg(el[key]);
        buttonClose(td, el.id);
        td.querySelector('polygon').addEventListener('mousedown', (e) => mouseResizeHeight(e, state, trLine, container, render));
      };
      trLine.append(td);
    });
    table.append(trLine);
    trLine.addEventListener('mousedown', (e) => onMouseDragAndDrop(e, state, trLine, container, render, reorder));
    trLine.addEventListener('mouseover', (e) => {
      e.stopPropagation();
      if (e.buttons !== 1 || state.move) {
        return;
      };
      trLine.style.backgroundColor = '#215dbf';
      trLine.style.cursor = 'grab'
      state.drag = trLine.id;
    });
    trLine.addEventListener('mouseout', (e) => {
      if (e.buttons !== 1 || state.move) {
        return;
      }
      trLine.style.backgroundColor = '';
      state.drag = '';
      trLine.style.cursor = '';
    });
  });

  const addData = document.createElement('button');
  addData.innerText = 'add';
  addData.className = 'add';

  addData.addEventListener('click', async (e) => {
    addData.setAttribute('disabled', 'true');
    buttondReset.setAttribute('disabled', 'true');
    await dataRequest(state);
    if (state.requestStatus === 'ERROR') {
      return;
    };
    render(state);
    addData.removeAttribute('disabled');
    buttondReset.removeAttribute('disabled');
  });

  table.append(addData);

  container.style.opacity = '1';
  container.style.transition = '2s';
  buttondReset.style.display = '';
  plug.style.display = 'none';
};

const onClickRequest = async () => {
  buttondDownload.setAttribute('disabled', 'true');
  buttondReset.setAttribute('disabled', 'true');
  if (state.arrData.length === 0) {
    await dataRequest(state);
    if (state.requestStatus === 'ERROR') {
      buttondReset.removeAttribute('disabled');
      buttondDownload.removeAttribute('disabled');
      plug.innerText = 'Повторите попытку'
      return;
    };
  };
  render(state);
  buttondReset.removeAttribute('disabled');
};

const onClickRes = async () => {

  localStorage.setItem("state", null);
  state.arrData = [];
  state.arrDataKeys = [];
  buttondDownload.removeAttribute('disabled');
  state.style = {};
  render(state);
};

const app = async () => {
  buttondDownload.addEventListener('click', onClickRequest);
  buttondReset.addEventListener('click', onClickRes);
  const localStorageState: Istate = JSON.parse(localStorage.getItem('state'));
  if (localStorageState !== null) {
    const keys: string[] = Object.keys(localStorageState);
    for (const key of keys as (keyof Istate)[]) {
      state[key] = localStorageState[key];
    };
    buttondDownload.setAttribute('disabled', 'true');
  };
  render(state);
};

app();
