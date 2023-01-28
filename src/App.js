import React, {useEffect, useRef, useState} from 'react'
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import './style/style.css'

const App = () => {
  const thumbnailArea= useRef(null);
  const timelineArea= useRef(null);
  const seekBarArea= useRef(null);
  const videoArea= useRef(null);
  const video= useRef(null);
  const file= useRef(null);
  const imgArea= useRef([]);
  const spanArea= useRef([]);
  const [filePath,setFilePath]= useState('');
  const [seekBar,setSeekBar]= useState('');
  const [imgArr,setImgArr]= useState([]);
  const [spanArr,setSpanArr]= useState([]);
  const [videoThumbnail,setThumbnails]= useState([]);
  const [seekValue, setSeekValue] = useState([0,0])
  const gg = 'test21'


  useEffect(()=> {
    imgArea.current = imgArea.current.slice(0, imgArr.length)
    imgArea.current.map((item,index) => {
      item.addEventListener('click', () => {
          console.log(`비디오 재생 시간 변경 ${videoArea.current.currentTime} --> ${videoThumbnail[index].second}`)
          // const video = document.querySelector('#video');
          // const seekBar = document.querySelector('#seekBar');
          videoArea.current.currentTime = videoThumbnail[index].second;
          seekBarArea.current.value = videoThumbnail[index].second;
      });

    })
  },[imgArr])
  useEffect(()=> {
    if(videoThumbnail.length > 0){
      console.log('video',videoThumbnail.length)
      spanArea.current = spanArea.current = new Array(videoThumbnail.length)
    }
  },[videoThumbnail])

  useEffect(()=> {
    if(spanArea.current.length > 0){
    }
  },[spanArea.current])
  
  useEffect(() => {
    spanArea.current.map((item,index) =>{
      item.textContent = spanArr[index].textContent
    })
    
  },[spanArr])


  const setSeekBarValue = (e) => {
    // console.log(e.currentTarget.value)
    // video.current.currentTime = e.currentTarget.value;
    // video.current.currentTime = e[0];
    setSeekValue(value => {
      console.log(value)
      if(value[0] === e[0]){// start point이 같으면 endpoint로 current로 바꾼다.
        video.current.currentTime = e[1];
      }else if(value[1] === e[1]){// 반대
        video.current.currentTime = e[0];
      }else if(value[0] !== e[0] && value[1] !== e[1]){// seekbar 이동시 처리
        video.current.currentTime = e[0];
      }
      return e
    })
  }

  const fileChange = (e) => {
    const formData = new FormData();
    formData.append('uploadFiles', file.current.files[0]);
    formData.append('key', 'value');
    fetchData(formData)
  }

  const fetchData = (formData) => {
    fetch('http://10.90.100.231:3001/upload',
      {
          method: 'post',
          body: formData
      })
      .then((res) => res.json())
      .then((result) => {
        const { filename, filePath, thumbnails, destination, duration } = result;
        document.querySelector('#file-name').innerHTML = filename;
        setFilePath('http://10.90.100.231:3001'+ filePath)
        setThumbnails(thumbnails)
        video.current.addEventListener('loadeddata', () => {
          console.log('load')
            // 썸네일 렌더링
            let start = 0;
            let end = 0;
            const imgArray = []
            const spanArray = []
            thumbnails.forEach((thumbnail, i) => {
                console.log(destination + '/' + thumbnail.filename)
                imgArray.push('http://10.90.100.231:3001'+destination + '/' + thumbnail.filename)
                start = parseFloat(thumbnail.second).toFixed(2);
                end = parseFloat(thumbnail[i + 1] ? thumbnail[i + 1].second : video.current.duration).toFixed(2);
                spanArray.push({
                  textContent : `${start}초 ~ ${end}초`,
                  width: `${video.current.videoWidth / 10}px`
                })
            });
            setSpanArr(spanArray)
            setImgArr(imgArray)

            // 시크바 렌더링
            const seekBarElement = {
              id : 'seekBar',
              type : 'range',
              value : '0',
              min : '0',
              max : duration,
              step : '0.1',
              width : `${video.current.videoWidth}px`
            };
            setSeekBar(seekBarElement)
          });
      }).catch(console.error)
  }
  
  useEffect(() => {
        // 파일선택버튼클릭
        // document.querySelector('#file-select').addEventListener('click', () => document.querySelector('#file').click());
  }, [])
  
  return (
    <>
      <header>
        
        <h3 id="title">동영상 편집 Sample{imgArr.length}</h3>
        <div id="upload-file">
            <a id="file-select" className="a-btn" onClick={() => document.querySelector('#file').click()}>파일선택</a>
            <span id="file-name"></span>
            <input id="file" ref={file} className="hide" type="file" onChange={fileChange} />
        </div>
    </header>
    <div id="container">
        <div id="viewerContainer">
            <div id="videoArea" ref={videoArea}>
              <video id="video" controls  ref={video} src={filePath}></video>
            </div>
            <div id="timelineContainer">
                <div id="thumbnailArea" ref={thumbnailArea}>
                  {
                    imgArr.length > 0 && imgArr.map((item,index) => 
                      <img src={item} ref={(el) => (imgArea.current[index] =el)} width={50} height={50} key={index}></img>                      
                    )
                  }
                </div>
                <div id="timelineArea" ref={timelineArea}>
                  {/* {
                    spanArr.length > 0 && spanArr.map((item,index) => 
                  <span style={{'width': `${video.current.videoWidth / 10}px`}} ref={(el) => (spanArea.current[index] =el)} key={index}>
                  </span>
                  )} */}
                </div>
                <div id="seekBarArea" ref={seekBarArea}>
                  {/* <input id='seekBar' type={'range'} onInput={(e) => setSeekBarValue(e)} defaultValue={0} min={seekBar.min} max={seekBar.max} step={seekBar.step}
                  width={seekBar.width}
                  ></input> */}
                <RangeSlider id="range-slider" min={seekBar.min} defaultValue={seekBar} max={seekBar.max} step={seekBar.step} onInput={(e) => setSeekBarValue(e)}/>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}


export default React.memo(App)