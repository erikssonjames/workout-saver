import Head from "next/head";
import { Listbox, Transition } from "@headlessui/react";
import { useState, Fragment } from 'react';
import { FaChevronDown, FaChevronUp , FaCheck } from 'react-icons/fa';

const gymTypes = [
  { id: 1, type: "First timer!" },
  { id: 2, type: "Once a week, or less." },
  { id: 3, type: "Three times a week" },
  { id: 4, type: "Twice a week" },
  { id: 5, type: "Between four and six times a week." },
  { id: 6, type: "I practically live at the gym!" },
];

const NewUser = () => {
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState(gymTypes[0]);

  return (
    <>
      <Head>
        <title>New User</title>
      </Head>
      <div className="min-h-screen bg-purple-9 flex justify-center">
        <div className="flex flex-col mt-16">
          <div>
            <h1 className="font-semibold text-4xl">Welcome to Workout Saver!</h1>
            <p className="mt-2 font-semibold text-purple-1">To get started you need to set up your user account.</p>
          </div>
          <div className="mt-16 flex flex-col">
            <h1 className="text-xl">What&apos;s your name?</h1>
            <input 
              className="text-base mt-2 bg-purple-2/40 rounded-lg border-purple-7 border-2 pl-3 py-2"
              name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Zyzz" 
            />
          </div>
          <div className="mt-10 flex flex-col">
            <h1 className="text-xl">How often do you visit the gym?</h1>
            <Listbox value={selectedType} onChange={setSelectedType}>
              {({ open }) => (
                <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-purple-2/40 border-purple-7 border-2 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="text-base block truncate">{selectedType?.type}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    {open ? 
                      <FaChevronUp className="h-5 w-5" aria-hidden="true" />
                      :
                      <FaChevronDown className="h-5 w-5" aria-hidden="true" />
                    }
                    
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-purple-2/40 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {gymTypes.map((type) => (
                      <Listbox.Option 
                        className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 
                        ${active ? 'bg-purple-4 text-white font-semibold' : 'text-inherit' }`}
                        key={type.id} value={type}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}>
                              {type.type}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-2">
                                <FaCheck className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
              )}
            </Listbox>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewUser;