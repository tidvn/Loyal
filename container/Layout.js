
import Header from './Header'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <>
    <div className="container mx-auto">
      <Header />
      <main>{children}</main>
      <Footer />
      </div>
    </>
  )
}