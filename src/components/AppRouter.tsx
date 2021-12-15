import React, { useState, FC} from 'react'
import { Route, Routes } from 'react-router-dom'

import SavedRequestsContainer from '../pages/SavedRequests/SavedRequestsContainer'
import MainContainer from '../pages/Main/MainContainer'
import Auth from '../pages/Auth/Auth'
import Modal from './Modal/Modal';
import { AppStateType } from '../redux/store'
import { connect } from 'react-redux'


export const MAIN_ROUTE = '/'
export const SEARCH_ROUTE = '/search'
export const SAVED_ROUTE = '/saved'
export const AUTH_ROUTE = '/auth'


const AppRouter: FC<{query: string}> = ({query}) => {  
  return (
    <div >
      <Routes>
        <Route path={SAVED_ROUTE} element={<SavedRequestsContainer />} />
        <Route path={AUTH_ROUTE} element={<Auth />} /> 
        <Route path={MAIN_ROUTE} element={<MainContainer />}>
          <Route path={SEARCH_ROUTE} element={<MainContainer />} />
        </Route>
      </Routes>
    </div>
  )
}

const mapStateToProps = (state: AppStateType) => ({
  query: state.main.queryString
})

export default connect(mapStateToProps, {})(AppRouter)