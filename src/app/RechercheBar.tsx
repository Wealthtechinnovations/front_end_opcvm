"use client";
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Link from 'next/link';

async function getlastvl1() {
    const data = (
        await fetch(`/api/searchFunds`)
    ).json();
    console.log("post")
    return data;
}
interface Option {
    value: string;
    // Autres propriétés si nécessaire
}
const RechercheBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFund, setSelectedFund] = useState<Option[]>([]);
    const [fundsOptions, setFundsOptions] = useState([]);


    useEffect(() => {
        // Appel à l'API lors du premier rendu du composant
        async function fetchData() {
            try {
                console.log("vvdddv")
                const data1 = await getlastvl1();
                console.log("vvdddv")
                console.log(data1?.data.funds);
                const mappedOptions = data1?.data.funds.map((funds: any) => ({
                    label: funds.label, // Replace with the actual property name
                    value: funds.value, // Replace with the actual property name
                }));

                console.log(mappedOptions)
                setFundsOptions(mappedOptions);

            } catch (error) {
                console.error("Erreur lors de l'appel à l'API :", error);
            }
        }
        fetchData();
    }, []);

    const handleSearch = (e: any) => {
        e.preventDefault();
        // Effectuez votre recherche ici si nécessaire
    };

    const handleFundSelect = (selectedOption: any) => {
        setSelectedFund(selectedOption);
    };
    console.log(fundsOptions)

    return (
        <div className="app-menu">
            <ul className="header-megamenu nav">
                <li className="btn-group d-md-inline-flex d-none">
                    <div className="app-menu">
                        <div className="search-bx mx-5">
                            <form onSubmit={handleSearch}>
                                <div className="input-group">
                                    <Select className="select-component"
                                        options={fundsOptions}
                                        value={selectedFund}
                                        onChange={handleFundSelect}
                                        placeholder="Select a fund"
                                    />
                                    <div className="input-group-append">
                                        <Link
                                            href={{
                                                pathname: '/counter',
                                                // query: { fund: selectedFund ? selectedFund.value : '' },
                                            }}
                                        >
                                            OK
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );

};

export default RechercheBar;
async function searchFunds(searchTerm: any) {
    // const response = await fetch(`/api/searchFunds?query=${searchTerm}`);
    const response = await fetch(`/api/searchFunds`);
    const data = await response.json();
    console.log(data);
    return data;
}
