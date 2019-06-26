// cleanco
// started as js port of cleanco python (Petri Savolainen petri.savolainen@koodaamo.fi) and evolved
//
const data = require('./data');

const types  = Object.entries(data.terms_by_type).reduce((a,x)=>{x[1]
                    .map(y=>a[y]=x[0]); return a}, {});

const type_sorted = Object.keys(types).sort((a,b)=>b.length-a.length);

const suffix_sorted = Object.entries(data.terms_by_type)
                        .reduce((a,x)=>a.concat(x[1]), [])
                        .concat( Object.entries(data.terms_by_country).reduce((a,x)=>a.concat(x[1]), []) )
                        .sort((a,b)=>b.length-a.length);

const suffices = suffix_sorted.reduce( (a,x)=>{a[x]=x;return a;}, {});

class cleanco{

    strip(s){                                               // remove reduncant whitespaces
        return s.trim().split(/\s+/).join(' ').replace(/[^\.\w]+/g, ' ');
    }

    type(name){
        var s = this.strip(name).toLowerCase();
        for(var suf of type_sorted)
            if( s.endsWith(' '+suf ))return types[suf];
        return '';
    }

    _check_at(parts, idx, count){
        if( idx<0 || parts.length<idx+count )return false;
        var part = parts.slice(idx, idx+count).join(' ');
        if( !suffices.hasOwnProperty(part) )return false;
        parts.splice(idx, count);
        return true;
    }

    clean(name){
        var s = this.strip(name).toLowerCase().split(' ').filter(Boolean);
        do{
            if( this._check_at(s, s.length-3, 3) ||
                this._check_at(s, s.length-3, 2) ||
                this._check_at(s, s.length-3, 1) ||
                this._check_at(s, s.length-2, 2) ||
                this._check_at(s, s.length-2, 1) ||
                this._check_at(s, s.length-1, 1) ||
                this._check_at(s, 0, 2) ||
                this._check_at(s, 0, 1) )continue;
            break;
        }while(s.length>0);
        return ( s.length == 0 ) ? name : s.join(' ');
    }

    // original port of Petri Savolainen
    clean2(name, suffix=true, prefix=false, middle=false, multi=false){
        var s = this.strip(name).toLowerCase();

        for(var suf of suffix_sorted){
            if( suffix && s.endsWith(' '+suf )){
                s = this.strip(s.substr(0, s.length-suf.length-1));
                if( !multi )break;
            }
            if( prefix && s.startsWith(suf+' ' )){
                s = this.strip(s.substr(suf.length+1));
                if( !multi )break;
            }
            if( middle ){
                var idx = s.indexOf(' '+suf+' ');
                if( idx >= 0 ){
                    s = this.strip(s.substr(0, idx)+s.substr(idx+suf.length+1));
                    if( !multi )break;
                }
            }
        }
        return this.strip(s);
    }
}

module.exports = new cleanco();
