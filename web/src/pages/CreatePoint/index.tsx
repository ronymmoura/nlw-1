import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import { Map, TileLayer, Marker } from "react-leaflet";
import axios from "axios";

import logo from "../../assets/logo.svg";
import "./styles.css";

import api from "../../services/api";
import { LeafletMouseEvent } from "leaflet";
import Dropzone from "../../components/Dropzone";

interface Items {
    id: number;
    image: string;
    image_url: string;
    title: string;
}

const CreatePoint: React.FC = () => {
    const history = useHistory();

    const [items, setItems] = useState<Items[]>([]);
    const [ufList, setUfList] = useState<string[]>([]);
    const [citiesList, setCitiesList] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
    });

    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
        0,
        0,
    ]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([
        0,
        0,
    ]);

    useEffect(() => {
        (async () => {
            const { data: items } = await api.get("items");
            setItems(items);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const { data: ufListFromApi } = await axios.get(
                "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
            );

            const ufList = ufListFromApi.map((uf: any) => {
                return uf.sigla;
            });

            setUfList(ufList);
        })();
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setInitialPosition([
                position.coords.latitude,
                position.coords.longitude,
            ]);
        });
    }, []);

    useEffect(() => {
        (async () => {
            if (selectedUf === "0") setCitiesList([]);

            const { data: citiesFromApi } = await axios.get(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`
            );

            const citiesList = citiesFromApi.map((uf: any) => {
                return uf.nome;
            });

            setCitiesList(citiesList);
        })();
    }, [selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([event.latlng.lat, event.latlng.lng]);
    }

    function handleSelectItem(id: number) {
        let items = selectedItems;
        if (items.includes(id)) {
            const filteredItems = items.filter((item) => item !== id);
            setSelectedItems(filteredItems);
        } else setSelectedItems([...items, id]);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const [latitude, longitude] = selectedPosition;

        const data = new FormData();

        data.append("name", name);
        data.append("email", email);
        data.append("whatsapp", whatsapp);
        data.append("latitude", String(latitude));
        data.append("longitude", String(longitude));
        data.append("city", selectedCity);
        data.append("uf", selectedUf);
        data.append("items", selectedItems.join(","));

        if (selectedFile) data.append("image", selectedFile);

        await api.post("points", data);
        alert("Ponto de coleta criado!");
        history.push("/");
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt={"Ecoleta"} />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>
                    Cadastro do
                    <br />
                    ponto de coleta
                </h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor={"name"}>Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor={"email"}>E-mail</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor={"whatsapp"}>Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map
                        center={initialPosition}
                        zoom={15}
                        onClick={handleMapClick}
                    >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufList.map((uf, index) => {
                                    return (
                                        <option key={index} value={uf}>
                                            {uf}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city" id="city">
                                Cidade
                            </label>
                            <select
                                name="uf"
                                id="uf"
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {citiesList.map((city, index) => {
                                    return (
                                        <option key={index} value={city}>
                                            {city}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map((item, index) => {
                            return (
                                <li
                                    key={index}
                                    onClick={() => handleSelectItem(item.id)}
                                    className={
                                        selectedItems.includes(item.id)
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                    />
                                    <span>{item.title}</span>
                                </li>
                            );
                        })}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
};

export default CreatePoint;
