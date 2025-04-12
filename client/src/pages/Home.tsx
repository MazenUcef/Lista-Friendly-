import BrandsSection from '../components/BrandsSection'
import Greeting from '../components/Greeting'
import Services from '../components/Services'
import SignUpSection from '../components/SignUpSection'

const Home = () => {
    return (
        <div className='min-h-screen mx-auto'>
            <Greeting />
            <Services />
            <BrandsSection />
            {/* <BondSection /> */}
            <SignUpSection />
        </div>
    )
}

export default Home