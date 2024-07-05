// pagination frontend

"use client"

// imports
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { MenuItem, Select } from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const Main = () => {

    // api url
    const baseUrl = "https://yourApiUrl.com"

    // rows per page drop down data
    const _rowsPerPage: number[] = [
        10, 20, 30, 40, 50, 60, 70
    ]

    // data documents
    const [users, setUsers] = useState<any>([])
    // no of total documents loaded (for current page)
    const [loadedUsers, setLoadedUsers] = useState<any>([])
    // rows per page drop down
    const [rowsPerPage, setRowsPerPage] = useState<number>(10)
    // page number (1 page is equals to 1 document)
    const [pageNumber, setPageNumber] = useState<number>(0)
    // total documents in database
    const [totalDocs, setTotalDocs] = useState<number>(0)
    // total pages (1 page is not equals to 1 document this is an actual page)
    const [totalPages, setTotalPages] = useState<number>(0)


    // total pages according to documents and rows per page
    useEffect(() => {
        setTotalPages(Math.ceil(totalDocs / rowsPerPage) ? Math.ceil(totalDocs / rowsPerPage) : 1)
    }, [totalDocs, rowsPerPage])


    // get users api call on page reload
    useEffect(() => {
        getUsers()
    }, [])


    // get users api call when rows per page changes or page number changes
    useEffect(() => {
        getUsers()
    }, [rowsPerPage, pageNumber])

    // get users function
    const getUsers = async () => {

        try {

            const resp = await axios.get(`${baseUrl}/api/v1/pagination?page=${pageNumber}&page-size=${rowsPerPage}`, {
                withCredentials: true
            })

            setUsers(resp?.data?.data)
            setLoadedUsers(+loadedUsers + +resp?.data?.data.length)
            setTotalDocs(resp?.data?.totalDocuments)

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <>

                <>
                    <div>
                        <div>
                            {/* render users table */}
                            <>
                                <div className="w-full flex flex-col">
                                    {
                                        users?.length ? users?.map((user: any, i: number) =>
                                            <p key={i}>user {i}</p>
                                        ) : <p>no users</p>
                                    }
                                </div>
                            </>
                            {/* pagination ui and logics */}
                            <>
                                <div className="paginationCont">
                                    {/* rows per page */}
                                    <>
                                        <div className="flex justify-start items-center gap-2">
                                            <Select
                                                disabled={totalDocs <= 10}
                                                defaultValue={10}
                                                value={rowsPerPage}
                                                onChange={(e: any) => setRowsPerPage(e.target.value)}
                                            >
                                                {
                                                    _rowsPerPage?.map((row: any) => (
                                                        <MenuItem value={row}
                                                            key={row}
                                                        >
                                                            {row}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                            <p className={`font-bold text-[${(totalDocs <= 10) ? "#979797" : ""}]`}>rows per page</p>
                                        </div>
                                    </>
                                    {/* page number */}
                                    <>
                                        <div className="flex justify-end items-center gap-2">
                                            {/* go to first page */}
                                            <>
                                                <FirstPageIcon
                                                    onClick={() => {
                                                        setPageNumber(0)
                                                    }}
                                                    // conditional styles
                                                    style={{
                                                        cursor: (Math.ceil((pageNumber + 1) / rowsPerPage) > 1) ? "pointer" : "",
                                                        pointerEvents: (Math.ceil((pageNumber + 1) / rowsPerPage) > 1) ? "auto" : "none",
                                                        color: (Math.ceil((pageNumber + 1) / rowsPerPage) > 1) ? "" : "#979797"
                                                    }} />
                                            </>
                                            {/* go to previous page */}
                                            <>
                                                <ChevronLeftIcon
                                                    onClick={() => {
                                                        setPageNumber(Math.max(0, pageNumber - rowsPerPage))
                                                    }}
                                                    // conditional styles
                                                    style={{
                                                        cursor: (Math.ceil((pageNumber + 1) / rowsPerPage) > 1) ? "pointer" : "",
                                                        pointerEvents: (Math.ceil((pageNumber + 1) / rowsPerPage) > 1) ? "auto" : "none",
                                                        color: (Math.ceil((pageNumber + 1) / rowsPerPage) > 1) ? "" : "#979797"
                                                    }} />
                                            </>
                                            {/* showing current page (eg. page 3 of 12 ) */}
                                            <>
                                                <div className="flex justify-center items-center gap-4">
                                                    <p className="py-2 px-4 flex justify-center items-center border rounded-md">{Math.ceil((pageNumber + 1) / rowsPerPage)}</p>
                                                    <p className="font-bold">of {Math.ceil(totalPages)} {Math.ceil(totalPages) > 1 ? "pages" : "page"}</p>
                                                </div>
                                            </>
                                            {/* go to next page */}
                                            <>
                                                <ChevronRightIcon
                                                    onClick={() => {
                                                        setPageNumber(pageNumber + rowsPerPage)
                                                    }}
                                                    // conditional styles
                                                    style={{
                                                        cursor: (Math.ceil((pageNumber + 1) / rowsPerPage) < totalPages) ? "pointer" : "",
                                                        pointerEvents: (Math.ceil((pageNumber + 1) / rowsPerPage) < totalPages) ? "auto" : "none",
                                                        color: (Math.ceil((pageNumber + 1) / rowsPerPage) < totalPages) ? "" : "#979797"
                                                    }} />
                                            </>
                                            {/* go to last page */}
                                            <>
                                                <LastPageIcon
                                                    onClick={() => {
                                                        setPageNumber(totalPages > 0 ? (totalPages - 1) * rowsPerPage : 0)
                                                    }}
                                                    // conditional styles
                                                    style={{
                                                        cursor: (Math.ceil((pageNumber + 1) / rowsPerPage) < totalPages) ? "pointer" : "",
                                                        pointerEvents: (Math.ceil((pageNumber + 1) / rowsPerPage) < totalPages) ? "auto" : "none",
                                                        color: (Math.ceil((pageNumber + 1) / rowsPerPage) < totalPages) ? "" : "#979797"
                                                    }} />
                                            </>
                                        </div>
                                    </>
                                </div>
                            </>
                        </div>
                    </div>
                </>
            </>
        </>
    )
}

export default Main