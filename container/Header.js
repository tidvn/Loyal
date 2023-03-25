import { CardanoWallet} from "@meshsdk/react";
import Link from "next/link";
export default function Header() {
    return (
<div className="navbar bg-base-100">
  <div className="flex-1">
    <Link href="/" className="btn btn-ghost normal-case text-xl">Home</Link>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
    <li><Link href="/payment/63fd8142e000ab07e16931d8">Payment</Link></li>
      <li><Link href="/trans">Chuyển asset</Link></li>
      <li tabIndex={0}>
        <a>
          Mint Asset
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
        </a>
        <ul className="p-2 bg-base-100">
          <li><Link href="/mAsset">Mint Asset</Link></li>
          <li><Link href="/mToken">Mint Token</Link></li>
        </ul>
      </li>
      <CardanoWallet />
    </ul>
  </div>
</div>
  
    )
  }
  