
class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    // this search filter can search according to the document name , introduction and category.
    search(){
        const keyword = this.queryStr.keyword
        ? {
              $or: [
                { name: { $regex: this.queryStr.keyword, $options: 'i' } },
                { introduction: { $regex: this.queryStr.keyword, $options: 'i' } },
                { category: { $regex: this.queryStr.keyword, $options: 'i' } },
              ]
            } : {};
        this.query = this.query.find({...keyword});
        return this;
      }
}


module.exports = ApiFeatures;