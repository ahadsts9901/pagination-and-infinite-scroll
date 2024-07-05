"use client"

import React, { useState, useEffect, useCallback } from 'react'
import axios from "axios";
import { debounce } from "lodash" // install this package from npm =====> "npm i lodash"

const Main = () => {

    // api url
    const baseUrl = "https://yourApiUrl.com"

    // data
    const [users, setUsers] = useState<{}[]>([])
    // load more data or not (depends on scrolling)
    const [loadMore, setLoadMore] = useState<boolean>(false)
    // scrollbar percentage
    const [scrollPercentage, setScrollPercentage] = useState<number>(0)


    // get data on page reload (very first time)
    useEffect(() => {

        const _getUsers = async () => {

            try {

                const resp = await axios.get(`${baseUrl}/api/v1/infinite-scroll?page=${0}}`, { withCredentials: true })
                setUsers([...resp?.data?.data])

            } catch (error) {
                console.error(error)
            }

        }

        _getUsers()

    }, [])


    // getData on infinite scroll
    const getUsers = async (length: number) => {

        try {

            const resp = await axios.get(`${baseUrl}/api/v1/infinite-scroll?page=${length}`, { withCredentials: true })
            setUsers((prev: any) => [...prev, ...resp?.data?.data])

        } catch (error) {
            console.error(error)
        }

    }

    
    // infinite scroll
    const handleScroll = useCallback(
        // debounce is used for one api call at a time
        debounce(() => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const scrollPos = (scrollTop / (scrollHeight - clientHeight)) * 100;
            setScrollPercentage(scrollPos);
        }, 200),
        []
    );

    useEffect(() => {

        window?.addEventListener('scroll', handleScroll);

        return () => {
            window?.removeEventListener('scroll', handleScroll);
        };

    }, []);

    useEffect(() => {
        // load more data when scroll id 60% done, you can change it according to your requirements
        if (scrollPercentage > 60 && !loadMore) {
            setLoadMore(true);
        }
    }, [scrollPercentage]);

    useEffect(() => {
        if (loadMore) {
            getMoreUsers();
            setLoadMore(false);
        }
    }, [loadMore]);

    const getMoreUsers = async () => {

        getUsers(users?.length)

    }

    return (
        <>
            <div className="container">
                {
                    users?.length ? users?.map((user: any, i: number) => (
                        <p>user {i}</p>
                    )) : null
                }
            </div>
        </>
    )

}

export default Main