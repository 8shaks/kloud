import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import searchStyles from './search.module.scss';
import { connect } from "react-redux";
import { ProfileType, PostType } from '../../@types/customType';
import { getAllProfiles } from '../../redux/actions/profileActions';
import e from 'express';

interface Props {
    profiles:ProfileType[],
    posts: PostType[],
    postSearch: boolean,
    setPosts: Dispatch<SetStateAction<PostType[]>>,
    setProfiles: Dispatch<SetStateAction<ProfileType[]>>,
}
const Search = (props:Props) =>  {

    const [postSearch, setPostSearch] = useState(true);
    const { posts, profiles, setPosts, setProfiles} = props;

    // const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearch(e.target.value);
    // }

    const onSearch = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(postSearch) {
            setPosts(posts.filter((post) => {
                return post.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            }));
        }else if(!postSearch){
            setProfiles(profiles.filter((profile) => {
                return profile.username.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            }));
        }
    }

    return (
        <div className={searchStyles.search}>
            <form onSubmit={onSearch}><input placeholder="Search" value={search} onChange={onChange} /> <button type="submit">Search</button></form>
        </div>
    )
}
// const mapStateToProps = (state: Props) => ({
//     auth: state.auth,
//     profile: state.profile,
//   });
  
//   export default connect(
//     mapStateToProps,
//     {getAllProfiles}
//   )(Search);

export default Search