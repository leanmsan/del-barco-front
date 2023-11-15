//import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({children, ...rest}) => [
    console.log('Private route works')
    return (
        <Route {...rest}>{children}</Route>
    )
]