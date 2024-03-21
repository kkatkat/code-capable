import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Problem } from "../../entities/problem";
import { getAllProblemsFiltered } from "../../services/problem-service";
import { Paginated } from "../../common/lib";


export default function ProblemsPage() {
    const [orderFilter, setOrderFilter] = useState<'desc' | 'asc' | ''>('');
    const [difficultyFilter, setDifficultyFilter] = useState<'easy' | 'medium' | 'hard' | ''>('');
    const [queryFilter, setQueryFilter] = useState<string | undefined>('');
    const [pageFilter, setPageFilter] = useState<string | undefined>('');
    const [problems, setProblems] = useState<Problem[]>([]);

    let [searchParams, setSearchParams] = useSearchParams();

    function handleFilterClick(e: any) {
        e.preventDefault();

        if (orderFilter) searchParams.set('order', orderFilter);
        if (difficultyFilter) searchParams.set('difficulty', difficultyFilter);
        if (queryFilter) searchParams.set('query', queryFilter);

        setSearchParams(searchParams)
    }

    function handlePageChange(e: any) {
        e.preventDefault();
        setPageFilter(e.target.value);
        searchParams.set('page', e.target.value);
        setSearchParams(searchParams);
    }

    function handleClearClick(e: any) {
        e.preventDefault();

        searchParams.delete('order');
        searchParams.delete('difficulty');
        searchParams.delete('query');

        setOrderFilter('');
        setDifficultyFilter('');
        setQueryFilter('');

        setSearchParams(searchParams)
    }

    function fetchProblems() {
        getAllProblemsFiltered({
            order: searchParams.get('order') ?? undefined,
            difficulty: searchParams.get('difficulty') ?? undefined,
            query: searchParams.get('query') ?? undefined,
            page: searchParams.get('page') ?? undefined,
            pageSize: searchParams.get('pageSize') ?? undefined
        }).then((res: Paginated<Problem>) => {
            setProblems(res.items);
            setPageFilter(res.currentPage.toString());
            console.log(res);
        })
    }

    useEffect(() => {
        console.log(searchParams.toString())
        fetchProblems()
        setDifficultyFilter(searchParams.get('difficulty') as '' | 'easy' | 'medium' | 'hard' || '');
        setOrderFilter(searchParams.get('order') as '' | 'desc' | 'asc' || '');
        setQueryFilter(searchParams.get('query') || '');
    }, [searchParams])

    return (
        <div className="cc-margin ProblemsPage">
            <div className="container-lg pt-2">
                <div className="card border-0 shadow-sm">
                    <div className="card-body py-2">
                        <form>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <div className="me-2">
                                        <select className="form-select form-select-sm bg-light" value={difficultyFilter} onChange={(e: any) => {setDifficultyFilter(e.target.value)}}>
                                            <option value={''} disabled selected>Difficulty</option>
                                            <option value='easy'>Easy</option>
                                            <option value='medium'>Medium</option>
                                            <option value='hard'>Hard</option>
                                        </select>
                                    </div>
                                    <div className="me-2">
                                        <select className="form-select form-select-sm bg-light" value={orderFilter} onChange={(e: any) => {setOrderFilter(e.target.value)}}>
                                            <option value={''} disabled selected> Order</option>
                                            <option value='desc'>Newest first</option>
                                            <option value='asc'>Oldest first</option>
                                        </select>
                                    </div>
                                    <div>
                                        <input type="text" className="form-control form-control-sm bg-light" placeholder="Search" value={queryFilter} onChange={(e) => {setQueryFilter(e.target.value)}}/>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn btn-light text-primary border-0 btn-sm me-2" onClick={handleFilterClick}><i className="bi bi-funnel me-1"></i>Filter</button>
                                    <button className="btn btn-light text-danger border-0 btn-sm" onClick={handleClearClick}><i className="bi bi-backspace me-1"></i>Clear</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}