import { Toaster } from 'react-hot-toast';
import AppRoutes from "./routes/AppRoutes"


const App = () => {
  return (
    <div>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000, // Default duration (3s)
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App