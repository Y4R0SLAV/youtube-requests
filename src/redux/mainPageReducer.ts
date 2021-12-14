import { Dispatch } from "react"
import { ThunkAction } from "redux-thunk"
import { videoApi } from './../api/api'
import { AppStateType } from "./store"

const SET_QUERY_STRING = "app/SET_QUERY_STRING"
const SET_VIDEO = "app/SET_VIDEO"


type VideoType = {
  title: string
  thumbnail: string
  url: string 
  publishedTime: Date
  description: string
  duration: Date
  viewCount: string

  channelTitle: string
  channelThumbnail: string
  channelUrl: string
  // нет только галочке на канале
}

type InitialStateType = {
  queryString: string
  videos: Array<VideoType>
}

const initialState: InitialStateType = {
  queryString: "azazin",
  videos: []
} 


const mainReducer = (state = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case SET_QUERY_STRING: 
      return {...state, queryString: action.query}

    case SET_VIDEO: 
      return {...state, videos: [action.params, ...state.videos]}

    default:
      return state
  }
}

// actions: 
type ActionsType = setQueryStringType | setVideoType

type setQueryStringType = {type: typeof SET_QUERY_STRING, query: string}
export const setQueryString = (query: string): setQueryStringType => ({ type: SET_QUERY_STRING, query })


type setVideoType = {type: typeof SET_VIDEO, params: VideoType}
export const setVideo = (params: VideoType): setVideoType => ({ type: SET_VIDEO, params })

// thunks: 
type DispatchType = Dispatch<ActionsType>
type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsType>


const presetVideo = ( title: string, thumbnail: string, url: string, publishedTime: Date,
                      description: string, duration: Date, viewCount: string, channelId: string ): ThunkType => {
  return async (dispatch: any) => {
    let data = await videoApi.getChannelInfo(channelId).then(data => data.items[0])
    dispatch(setVideo({
      title, thumbnail, url, publishedTime,
      description, duration, viewCount,

      channelTitle: data.snippet.title,
      channelThumbnail: data.snippet.thumbnails.default.url,
      channelUrl: channelId
    }))
  }
  
}

const getVideoInfo = (id: string): ThunkType => {
  return async (dispatch: any) => {
    let data = await videoApi.getVideoInfo(id).then(data => data.items[0]).then(data => {  
      dispatch(presetVideo( data.snippet.title,
                            data.snippet.thumbnails.medium.url,
                            data.id, 
                            data.snippet.publishedAt,
                            data.snippet.description,
                            data.contentDetails.duration,
                            data.statistics.viewCount,
                            data.snippet.channelId
      ))
    })

  }
}

export const getVideosId = (): ThunkType => {
  return async (dispatch: any ) => {
    let data = await videoApi.getVideos(initialState.queryString).then(data => data.items)

    for (let i = 0; i < data.length; i++) {
      dispatch(getVideoInfo(data[i].id.videoId))
      // по очереди передаются все айди полученные по запросу пользователя
    }
  }
}

export default mainReducer