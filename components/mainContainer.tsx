'use client'
import { Button } from "@nextui-org/react";
import { Link } from "@nextui-org/react";

const mainContainer = () => {
  return (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Sonni's Verwaltungstool</h1>
        <div className="text-center gap-10">
        <Link href="/events">
          <Button className="mr-4">Events</Button>
        </Link>
        <Link href="/mitarbeiter">
          <Button className="mr-4">Mitarbeiter</Button>
        </Link>
        <Link href="/objects">
          <Button>Objekte</Button>
        </Link>


      </div>
    </div>
  )
}

export default mainContainer