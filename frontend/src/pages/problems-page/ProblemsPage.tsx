import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Problem } from "../../entities/problem";
import { getAllProblemsFiltered } from "../../services/problem-service";
import { Paginated, useScrollToTop } from "../../common/lib";
import ProblemCard from "../../components/problem-card/ProblemCard";
import { Pagination } from "@mui/material";

export type ProblemsPageProps = {
    fullWidth?: boolean;
    creatorId?: number;
    topMargin?: boolean;
    hideSearch?: boolean;
    inContainer?: boolean;
}


export default function ProblemsPage({fullWidth, creatorId, topMargin, hideSearch, inContainer}: ProblemsPageProps) {
    useScrollToTop();
    const [orderFilter, setOrderFilter] = useState<'desc' | 'asc' | ''>('');
    const [difficultyFilter, setDifficultyFilter] = useState<'easy' | 'medium' | 'hard' | ''>('');
    const [queryFilter, setQueryFilter] = useState<string | undefined>('');
    const [pageFilter, setPageFilter] = useState<string | undefined>('');
    const [problems, setProblems] = useState<Problem[]>([]);
    
    const [totalPages, setTotalPages] = useState<number>(1);

    let [searchParams, setSearchParams] = useSearchParams();

    function handleFilterClick(e: any) {
        e.preventDefault();

        if (orderFilter) searchParams.set('order', orderFilter);

        if (difficultyFilter) searchParams.set('difficulty', difficultyFilter);

        if (queryFilter) {
            searchParams.set('query', queryFilter)
        } else {
            searchParams.delete('query');
        }

        searchParams.set('page', '1');
        setPageFilter('1');

        setSearchParams(searchParams)
    }

    function handlePageChange(e: any, value: number) {
        e.preventDefault();
        setPageFilter(value.toString());
        searchParams.set('page', value.toString());
        setSearchParams(searchParams);
    }

    function handleClearClick(e: any) {
        e.preventDefault();

        searchParams.delete('order');
        searchParams.delete('difficulty');
        searchParams.delete('query');
        searchParams.set('page', '1');

        setPageFilter('1');
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
            pageSize: searchParams.get('pageSize') ?? undefined,
            creatorId: creatorId ?? undefined,
        }).then((res: Paginated<Problem>) => {
            setProblems(res.items);
            setPageFilter(res.currentPage.toString());
            setTotalPages(res.totalPages);
            console.log(res);
        })
    }

    useEffect(() => {
        console.log(searchParams.toString())
        fetchProblems()
        setDifficultyFilter(searchParams.get('difficulty') as '' | 'easy' | 'medium' | 'hard' || '');
        setOrderFilter(searchParams.get('order') as '' | 'desc' | 'asc' || '');
        setQueryFilter(searchParams.get('query') || '');
    }, [searchParams, creatorId])

    return (
        <div className={`${topMargin ? 'cc-margin' : ''} ProblemsPage`}>
            <div className={`${inContainer ? 'container-lg pt-2' : ''}`}>
                <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body py-2">
                        <form>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <div className="me-2">
                                        <select className="form-select form-select-sm bg-light" value={difficultyFilter} onChange={(e: any) => { setDifficultyFilter(e.target.value) }}>
                                            <option value={''} disabled selected>Difficulty</option>
                                            <option value='easy'>Easy</option>
                                            <option value='medium'>Medium</option>
                                            <option value='hard'>Hard</option>
                                        </select>
                                    </div>
                                    <div className="me-2">
                                        <select className="form-select form-select-sm bg-light" value={orderFilter} onChange={(e: any) => { setOrderFilter(e.target.value) }}>
                                            <option value={''} disabled selected> Order</option>
                                            <option value='desc'>Newest first</option>
                                            <option value='asc'>Oldest first</option>
                                        </select>
                                    </div>
                                    {
                                        !hideSearch &&
                                        <div className="me-2">
                                            <input type="text" className="form-control form-control-sm bg-light" placeholder="Search" value={queryFilter} onChange={(e) => { setQueryFilter(e.target.value) }} />
                                        </div>
                                    }
                                    <div>
                                        <button className="btn btn-light text-primary border-0 btn-sm me-2" onClick={handleFilterClick} data-testid='filter-button'><i className="bi bi-funnel me-1"></i>Filter</button>
                                    </div>
                                    <div>
                                        <button className="btn btn-light text-danger border-0 btn-sm" onClick={handleClearClick} data-testid='filter-clear-button'><i className="bi bi-backspace me-1"></i>Clear</button>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Pagination count={totalPages} shape="rounded" page={+(pageFilter || '1')} onChange={handlePageChange} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="row gx-2" id='problems-container'>
                    {
                        problems.length === 0 ?
                        <div className="text-center">
                            <p className="text-muted">No problems found</p>
                        </div>
                        :
                        problems.map((problem) => {
                            return (
                                <div className={`${fullWidth ? 'col-12' : 'col-6'}`}>
                                    <ProblemCard key={problem.id} problem={problem} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}