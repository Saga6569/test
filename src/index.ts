import * as _ from 'lodash';
import './style.css';
import getdata from './print'

interface Identifier {
  [key: string]: string;
}

const state = {
  reset: false
}

const container = document.querySelector('.container')

const app = async () => {

  const arrData: Identifier[] = [];

  for (let i = 1; i <= 5; i++) {
    const newUrl = `https://swapi.dev/api/people/${String(i)}/`;
    const res: Identifier = await getdata(newUrl);
    // console.log(res)
    const keys = Object.keys(res);

    const newDate: Identifier = {};

    keys.forEach((key: string) => {
      if (!Array.isArray(res[key]) && key !== 'homeworld') {
        newDate[key] = res[key];
      };
    });
    arrData.push(newDate);
  }


  const keys = Object.keys(arrData[0])

  const buttondDownload = document.querySelector('.download')
  buttondDownload.addEventListener('click', (e: Event, reset = false) => {

    reset = state.reset

    const heder = document.querySelector('.name') as HTMLElement
    const childHeder = Array.from(heder.children) as HTMLElement[]

    keys.forEach((key: string, i: number) => {
      if (i === 0) {
        return
      }
      const line = document.querySelector(`.line_${i}`) as HTMLElement
      const childLine = Array.from(line.children);
      childLine.forEach((el: HTMLElement, j: number) => {
        if (j === 0) {
          el.innerText = reset ? '' : key
          return
        }
        childHeder[j].innerText = reset ? '' : arrData[j - 1].name
        el.innerText = reset ? '' :  arrData[j - 1][key]
      })
    })

    // setTimeout(() => {
    //   state.reset = true
    // }, 5000);

  })

}
app()
