import {atom} from 'recoil'

const authenticationAtom = atom({
    key : 'authenticationAtom' ,
    default : "login"
})

export default authenticationAtom;