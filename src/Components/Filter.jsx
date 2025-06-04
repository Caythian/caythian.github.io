import './Filter.css';
function Filter(){
    return(
         <div className="filter-wrapper">
            <div className="title">Paintings <span className="titlesc">绘画</span></div>
            <div className="title">Sculpture <span className="titlesc">雕塑</span></div>
            <div className="title">Installation <span className="titlesc">装置</span></div>
            <div className="title">Other <span className="titlesc">其他</span></div>
         </div>
    );
}
export default Filter;
