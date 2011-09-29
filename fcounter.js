var d				=	document;
var w				=	window;

function clock_init(timeleft, jstimenow, url, did, imgh) {
    var clock   = false;
 
    
    var f   = function() {
        if( ! clock ) { clock = new Clock2(timeleft, jstimenow, url, did, imgh); }
        clock.bind();
    };
    if( d.addEventListener ) {
        d.addEventListener("load", f, false);
        w.addEventListener("load", f, false);
    }
    else if( d.attachEvent ) {
        d.attachEvent("onload", f);
        w.attachEvent("onload", f);
    }
    f();
}

var Clock2  = function(timeleft, jstimenow, url, did, imgh)
{
    this.is_binded  = false;
    this.dv_h1  = false;
    this.dv_h2  = false;
    this.dv_m1  = false;
    this.dv_m2  = false;
    this.dv_s1  = false;
    this.dv_s2  = false;
    this.time   = timeleft;
    this.time0  = jstimenow;
    this.url    = url ? url : "";
    this.did    = did ? did : "";
    this.imgh   = imgh ? imgh : 39;
    this.tmp    = {};
    
    this.bind   = function() {
        if( this.is_binded ) { return; }
        this.is_binded  = true;
        if( ! this.time ) { return; }
        
        if( timeleft > 356399 ) {
            var clock   = new Clock3(timeleft, jstimenow, url, did, imgh);
            clock.bind();
            return;
        }
        
        this.dv_h1  = d.getElementById(did ? "clock2_"+this.did+"_h1" : "clock2_h1");
        this.dv_h2  = d.getElementById(did ? "clock2_"+this.did+"_h2" : "clock2_h2");
        this.dv_m1  = d.getElementById(did ? "clock2_"+this.did+"_m1" : "clock2_m1");
        this.dv_m2  = d.getElementById(did ? "clock2_"+this.did+"_m2" : "clock2_m2");
        this.dv_s1  = d.getElementById(did ? "clock2_"+this.did+"_s1" : "clock2_s1");
        this.dv_s2  = d.getElementById(did ? "clock2_"+this.did+"_s2" : "clock2_s2");
        this.nav    = get_nav();
        if( !this.dv_h1 || !this.dv_h2 || !this.dv_m1 || !this.dv_m2 || !this.dv_s1 || !this.dv_s2 ) {
            return;
        }
        var obj = this;
        if( this.tmp.tmout ) { clearTimeout(this.tmp.tmout); }
        this.tmp.tmout  = setTimeout( function(){ obj.bind_step2(); }, 20 );
        return true;
    };
    this.bind_step2 = function() {
        this.time   = parseInt(this.time,10);
        this.time0  = parseInt(this.time0,10);
        this.time   -= get_time() - this.time0;
        this.set_time();
        var obj = this;
        this.tmp.intrvl = setInterval( function() {
            obj.time    --;
            if( obj.time <= 0 ) {
                clearInterval(obj.tmp.intrvl);
                obj.end();
                obj.time    = 0;
                obj.set_time();
                return;
            }
            obj.set_time();
        }, 1000 );
    };
    this.set_time   = function() {
        if( this.tmp.slide_intrvl ) {
            clearInterval(this.tmp.slide_intrvl);
        }
        var s   = this.time;
        if( s<=0 ) { s = 0; }
        var h   = Math.floor(s/3600);
        s   -= h*3600;
        h   = Math.min(h,99);
        var m   = Math.floor(s/60);
        s   -= m*60;
        var h1  = h>9 ? Math.floor(h/10) : 0;
        var h2  = h>0 ? h%10 : 0;
        var m1  = m>9 ? Math.floor(m/10) : 0;
        var m2  = m>0 ? m%10 : 0;
        var s1  = s>9 ? Math.floor(s/10) : 0;
        var s2  = s>0 ? s%10 : 0;
        this.pos    = [this.imgh*h1, this.imgh*h2, this.imgh*m1, this.imgh*m2, this.imgh*s1, this.imgh*s2];
        this.set_pos();
        this.slide_to_next();
    };
    this.slide_to_next  = function() {
        var s   = this.time - 1;
        if( s<=0 ) { return; }
        var h   = Math.floor(s/3600);
        s   -= h*3600;
        h   = Math.min(h,99);
        var m   = Math.floor(s/60);
        s   -= m*60;
        var h1  = h>9 ? Math.floor(h/10) : 0;
        var h2  = h>0 ? h%10 : 0;
        var m1  = m>9 ? Math.floor(m/10) : 0;
        var m2  = m>0 ? m%10 : 0;
        var s1  = s>9 ? Math.floor(s/10) : 0;
        var s2  = s>0 ? s%10 : 0;
        var mv_h1   = h2==9 && m==59 && s==59;
        var mv_h2   = m==59 && s==59;
        var mv_m1   = m2==9 && s==59;
        var mv_m2   = s==59;
        var mv_s1   = s2==9;
        var mv_s2   = true;
        var obj = this;
        var period  = 1000;
        var px_tm   = 25;
        if( this.nav.is_msie ) {
            period  = 800;
        }
        else if( this.nav.is_chrome ) {
            period  = 900;
        }
        var px_st   = this.imgh / (period / px_tm);
        var f   = function() {
            if( mv_s2 ) { obj.pos[5] -= px_st; }
            if( mv_s1 ) { obj.pos[4] -= px_st; }
            if( mv_m2 ) { obj.pos[3] -= px_st; }
            if( mv_m1 ) { obj.pos[2] -= px_st; }
            if( mv_h2 ) { obj.pos[1] -= px_st; }
            if( mv_h1 ) { obj.pos[0] -= px_st; }
            obj.set_pos();
        };
        if( this.tmp.slide_intrvl ) {
            clearInterval(this.tmp.slide_intrvl);
        }
        this.tmp.slide_intrvl   = setInterval(f, px_tm)
        f();    
    };
    this.set_pos    = function() {
        var obj = this;
        setTimeout( function() { 
            obj.dv_h1.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[0]))+"px";
            obj.dv_h2.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[1]))+"px";
            obj.dv_m1.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[2]))+"px";
            obj.dv_m2.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[3]))+"px";
            obj.dv_s1.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[4]))+"px";
            obj.dv_s2.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[5]))+"px";
        }, 1);
    };
    this.end    = function() {
        var url = this.url;
        if( !url || url=="" ) {
            url = w.location.href;
        }
        url += url.indexOf("?")==-1 ? "/r:" : "&r=";
        url += Math.round(Math.random()*10000);
        w.location.href = url;
    };
}

var Clock3  = function(timeleft, jstimenow, url, did, imgh)
{
    this.is_binded  = false;
    this.dv_d1  = false;
    this.dv_d2  = false;
    this.dv_h1  = false;
    this.dv_h2  = false;
    this.dv_m1  = false;
    this.dv_m2  = false;
    this.time       = timeleft;
    this.time0  = jstimenow;
    this.url    = url ? url : "";
    this.did    = did ? did : "";
    this.imgh   = imgh ? imgh : 39;
    this.tmp    = {};
    
    this.bind   = function() {
        if( this.is_binded ) { return; }
        this.is_binded  = true;
        if( ! this.time ) { return; }
        
        this.dv_d1  = d.getElementById(did ? "clock2_"+this.did+"_h1" : "clock2_h1");
        this.dv_d2  = d.getElementById(did ? "clock2_"+this.did+"_h2" : "clock2_h2");
        this.dv_h1  = d.getElementById(did ? "clock2_"+this.did+"_m1" : "clock2_m1");
        this.dv_h1.className    = "counter_digit_hours";
        this.dv_h2  = d.getElementById(did ? "clock2_"+this.did+"_m2" : "clock2_m2");
        this.dv_m1  = d.getElementById(did ? "clock2_"+this.did+"_s1" : "clock2_s1");
        this.dv_m2  = d.getElementById(did ? "clock2_"+this.did+"_s2" : "clock2_s2");
        this.nav    = get_nav();
        if( !this.dv_d1 || !this.dv_d2 || !this.dv_h1 || !this.dv_h2 || !this.dv_m1 || !this.dv_m2 ) {
            return;
        }
        var obj = this;
        if( this.tmp.tmout ) { clearTimeout(this.tmp.tmout); }
        this.tmp.tmout  = setTimeout( function(){ obj.bind_step2(); }, 20 );
        return true;
    };
    this.bind_step2 = function() {
        this.time   = parseInt(this.time,10);
        this.time0  = parseInt(this.time0,10);
        this.time   -= get_time() - this.time0;
        this.set_time();
        var obj = this;
        this.tmp.intrvl = setInterval( function() {
            obj.time    --;
            if( obj.time <= 0 ) {
                clearInterval(obj.tmp.intrvl);
                obj.end();
                obj.time    = 0;
                obj.set_time();
                return;
            }
            obj.set_time();
        }, 1000 );
    };
    this.set_time   = function() {
        if( this.tmp.slide_intrvl ) {
            clearInterval(this.tmp.slide_intrvl);
        }
        var s   = this.time;
        if( s<=0 ) { s = 0; }
        
        var d   = Math.floor(s/86400);
        s   -= d*86400;
        var h   = Math.floor(s/3600);
        s   -= h*3600;
        h   = Math.min(h,99);
        var m   = Math.floor(s/60);
        s   -= m*60;
        var d1  = d>9 ? Math.floor(d/10) : 0;
        var d2  = d>0 ? d%10 : 0;
        var h1  = h>9 ? Math.floor(h/10) : 0;
        var h2  = h>0 ? h%10 : 0;
        var m1  = m>9 ? Math.floor(m/10) : 0;
        var m2  = m>0 ? m%10 : 0;
        this.pos    = [this.imgh*d1, this.imgh*d2, this.imgh*h1, this.imgh*h2, this.imgh*m1, this.imgh*m2];
        this.set_pos();
        this.slide_to_next();
    };
    this.slide_to_next  = function() {
        var s   = this.time - 1;
        if( s<=0 ) { return; }
        var d   = Math.floor(s/86400);
        s   -= d*86400;
        var h   = Math.floor(s/3600);
        s   -= h*3600;
        var m   = Math.floor(s/60);
        s   -= m*60;
        var d1  = d>9 ? Math.floor(d/10) : 0;
        var d2  = d>0 ? d%10 : 0;
        var h1  = h>9 ? Math.floor(h/10) : 0;
        var h2  = h>0 ? h%10 : 0;
        var m1  = m>9 ? Math.floor(m/10) : 0;
        var m2  = m>0 ? m%10 : 0;
        this.dv_h2.className    = h1==2 ? "counter_digit_hours2" : "counter_digit";
        var mv_d1   = d2==9 && h==23 && m==59 && s==59;
        var mv_d2   = h==23 && m==59 && s==59;
        var mv_h1   = (h==23 || h2==9) && m==59 && s==59;
        var mv_h2   = m==59 && s==59;
        var mv_m1   = m2==9 && s==59;
        var mv_m2   = s==59;
        var obj = this;
        var period  = 1000;
        var px_tm   = 25;
        if( this.nav.is_msie ) {
            period  = 800;
        }
        else if( this.nav.is_chrome ) {
            period  = 900;
        }
        var px_st   = this.imgh / (period / px_tm);
        var f   = function() {
            if( mv_m2 ) { obj.pos[5] -= px_st; }
            if( mv_m1 ) { obj.pos[4] -= px_st; }
            if( mv_h2 ) { obj.pos[3] -= px_st; }
            if( mv_h1 ) { obj.pos[2] -= px_st; }
            if( mv_d2 ) { obj.pos[1] -= px_st; }
            if( mv_d1 ) { obj.pos[0] -= px_st; }
            obj.set_pos();
        };
        if( this.tmp.slide_intrvl ) {
            clearInterval(this.tmp.slide_intrvl);
        }
        this.tmp.slide_intrvl   = setInterval(f, px_tm)
        f();    
    };
    this.set_pos    = function() {
        var obj = this;
        setTimeout( function() { 
            obj.dv_d1.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[0]))+"px";
            obj.dv_d2.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[1]))+"px";
            obj.dv_h1.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[2]))+"px";
            obj.dv_h2.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[3]))+"px";
            obj.dv_m1.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[4]))+"px";
            obj.dv_m2.style.backgroundPosition  = "0px "+(-Math.round(obj.pos[5]))+"px";
        }, 1);
    };
    this.end    = function() {
        var url = this.url;
        if( !url || url=="" ) {
            url = w.location.href;
        }
        url += url.indexOf("?")==-1 ? "/r:" : "&r=";
        url += Math.round(Math.random()*10000);
        w.location.href = url;
    };
}



function dealimgs2_init() {
    var dealimgs    = false;
    var f   = function() {
        if( ! dealimgs ) { dealimgs = new Dealimgs2(); }
        dealimgs.bind();
    };
    if( d.addEventListener ) {
        d.addEventListener("load", f, false);
        w.addEventListener("load", f, false);
    }
    else if( d.attachEvent ) {
        d.attachEvent("onload", f);
        w.attachEvent("onload", f);
    }
    f();
}

var Dealimgs2   = function()
{
    this.is_binded  = false;
    this.box    = false;
    this.imgs   = false;
    this.curr   = 0;
    this.lnk_prev   = false;
    this.lnk_next   = false;
    this.nav    = get_nav();
    this.tmp    = {};
    
    this.bind   = function() {
        if( this.is_binded ) { return; }
        this.box    = d.getElementById("nvp_image");
        if( ! this.box ) { return; }
        this.imgs   = this.box.getElementsByTagName("IMG");
        if( !this.imgs || this.imgs.length<=1 ) { return; }
        this.lnk_prev   = d.getElementById("nvp_slider_left");
        this.lnk_next   = d.getElementById("nvp_slider_right");
        if( !this.lnk_prev || !this.lnk_next ) { return; }
        this.is_binded  = true;
        this.curr   = 0;
        var obj = this;
        this.lnk_prev.onclick   = function() { obj.show_prev(); return false; };
        this.lnk_next.onclick   = function() { obj.show_next(); return false; };
        this.lnk_prev.onfocus   = function() { this.blur(); };
        this.lnk_next.onfocus   = function() { this.blur(); };
        this.lnk_prev.onmouseover   = function() { obj.autoslide_forbid(); };
        this.lnk_next.onmouseover   = function() { obj.autoslide_forbid(); };
        this.lnk_prev.onmouseout    = function() { obj.autoslide_allow(); };
        this.lnk_next.onmouseout    = function() { obj.autoslide_allow(); };
        if( this.tmp.tmout ) { clearTimeout(this.tmp.tmout); }
        this.tmp.tmout  = setTimeout( function(){ obj.bind_step2(); }, 20 );
        var controls    = d.getElementById("nvp_slider");
        if( controls ) {
            controls.onmouseover    = function() { obj.autoslide_forbid(); };
            controls.onmouseout     = function() { obj.autoslide_allow(); };
        }
        return true;
    };
    this.bind_step2 = function() {
        var obj = this;
        this.show_img(this.curr);
        for(var i=0; i<this.imgs.length; i++) {
            this.imgs[i].onmouseover    = function() { obj.autoslide_forbid(); };
            this.imgs[i].onmouseout     = function() { obj.autoslide_allow(); };
            if(i!=this.curr) {
                this.preload(this.imgs[i].src);
            }
        }
        this.imgs[this.curr].parentNode.style.position  = "relative";
        this.imgs[this.curr].parentNode.style.overflow  = "hidden";
    };
    this.show_prev  = function() {
        this.show_img_slow( this.curr==0 ? this.imgs.length-1 : this.curr-1, "ltr" );
    };
    this.show_next  = function() {
        this.show_img_slow( this.curr==this.imgs.length-1 ? 0 : this.curr+1, "rtl" );
    };
    this.show_next2 = function() {
        this.show_img_slow2( this.curr==this.imgs.length-1 ? 0 : this.curr+1 );
    };
    this.show_img   = function(c) {
        if( this.tmp.show_in_progress ) {
            return;
        }
        c   = Math.max(c, 0);
        c   = Math.min(c, this.imgs.length-1);
        this.imgs[this.curr].style.display  = "none";
        this.curr   = c;
        this.imgs[this.curr].style.display  = "block";
        var h   = parseInt(this.imgs[this.curr].style.height, 10);
        this.lnk_prev.style.top = Math.round((h - 100) / 2) +"px";
        this.lnk_next.style.top = Math.round((h - 100) / 2) +"px";
        this.lnk_prev.style.display = "block";
        this.lnk_next.style.display = "block";
        this.set_dots();
        this.autoslide_allow();
    };
    this.show_img_slow  = function(c, dir) {
        if( this.tmp.show_in_progress ) {
            return;
        }
        this.tmp.show_in_progress   = true;
        var newimg  = Math.max(c, 0);
        newimg  = Math.min(newimg, this.imgs.length-1);
        var curimg  = this.curr;
        this.imgs[curimg].parentNode.style.height   = this.imgs[newimg].style.height;
        this.imgs[curimg].style.position    = "absolute";
        this.imgs[newimg].style.position    = "absolute";
        this.imgs[curimg].style.top = "0px";
        this.imgs[newimg].style.top = "0px";
        var wd  = parseInt(this.imgs[newimg].style.width, 10);
        if( dir == "rtl" ) {
            this.imgs[curimg].style.right   = "auto";
            this.imgs[curimg].style.left    = "0px";
            this.imgs[newimg].style.left    = "auto";
            this.imgs[newimg].style.right   = (0-wd)+"px";
        }
        else {
            this.imgs[curimg].style.left    = "auto";
            this.imgs[curimg].style.right   = "0px";
            this.imgs[newimg].style.right   = "auto";
            this.imgs[newimg].style.left    = (0-wd)+"px";
        }
        this.imgs[newimg].style.display = "block";
        var obj = this;
        var x       = 0;
        var s       = 50;
        var f   = function() {
            x   += s;
            s   += 5;
            x   = Math.min(x, wd);
            if( dir == "rtl" ) {
                obj.imgs[newimg].style.right    = (x-wd)+"px";
                obj.imgs[curimg].style.left = (0-x)+"px";
            }
            else {
                obj.imgs[newimg].style.left = (x-wd)+"px";
                obj.imgs[curimg].style.right    = (0-x)+"px";
            }
            if( x >= wd ) {
                x   = wd;
                if( dir == "rtl" ) {
                    obj.imgs[newimg].style.right    = "0px";
                    obj.imgs[curimg].style.left = (0-wd)+"px";
                }
                else {
                    obj.imgs[newimg].style.left = "0px";
                    obj.imgs[curimg].style.right    = (0-wd)+"px";
                }
                try {
                    obj.imgs[newimg].style.position = "auto";
                    obj.imgs[newimg].style.left     = "auto";
                    obj.imgs[newimg].style.right        = "auto";
                    obj.imgs[curimg].style.display  = "none";
                    obj.imgs[curimg].style.position = "auto";
                    obj.imgs[curimg].style.left = "auto";
                    obj.imgs[curimg].style.right    = "auto";
                } catch(e) {  }
                clearInterval(obj.tmp.show_in_progress);
                obj.curr    = newimg;
                obj.tmp.show_in_progress    = false;
                obj.set_dots();
                obj.autoslide_allow();
                return;
            }
        };
        this.tmp.show_in_progress   = setInterval(f, 10);
    };
    this.show_img_slow2 = function(c) {
        if( this.tmp.show_in_progress ) {
            return;
        }
        this.tmp.show_in_progress   = true;
        var newimg  = Math.max(c, 0);
        newimg  = Math.min(newimg, this.imgs.length-1);
        var curimg  = this.curr;
        this.imgs[curimg].parentNode.style.height   = this.imgs[newimg].style.height;
        this.imgs[curimg].style.position    = "absolute";
        this.imgs[curimg].style.top = "0px";
        this.imgs[curimg].style.left    = "0px";
        this.imgs[curimg].style.zIndex  = 5;
        this.imgs[newimg].style.position    = "absolute";
        this.imgs[newimg].style.top = "0px";
        this.imgs[newimg].style.left    = "0px";
        this.imgs[newimg].style.zIndex  = 6;
        var obj = this;
        var op  = 0;
        this.imgs[newimg].style.opacity = op/100;
        this.imgs[newimg].style.MozOpacity  = op/100;
        this.imgs[newimg].style.filter  = "alpha(opacity="+op+")";
        this.imgs[newimg].style.display = "block";
        var step    = 3;
        if( this.nav.is_msie ) {
            step    = 10;
        }
        var f   = function() {
            op  += step;
            op  = Math.min(op, 100);
            obj.imgs[newimg].style.opacity  = op/100;
            obj.imgs[newimg].style.MozOpacity   = op/100;
            obj.imgs[newimg].style.filter       = "alpha(opacity="+op+")";
            if( op >= 100 ) {
                clearInterval(obj.tmp.show_in_progress);
                obj.imgs[obj.curr].style.display    = "none";
                obj.curr    = newimg;
                obj.tmp.show_in_progress    = false;
                obj.set_dots();
                obj.autoslide_allow();
                return;
            }
        };
        this.tmp.show_in_progress   = setInterval(f, 10);
    };
    this.preload    = function(src) {
        var i   = new Image();
        i.src   = src;
    };
    this.set_dots   = function() {
        var obj = this;
        var tmp = d.getElementById("nvp_slider_dots");
        if( tmp ) {
            tmp = tmp.getElementsByTagName("A");
            if( tmp && tmp.length == this.imgs.length ) {
                for(var i=0; i<this.imgs.length; i++) {
                    tmp[i].className    = tmp.length-i-1==this.curr ? "ondot" : "";
                    tmp[i].onclick      = function() { return false; }
                    if( tmp.length-i-1!=this.curr  ) {
                        tmp[i].onclick      = function() { obj.show_img_slow2(this.getAttribute("rel")); return false; };
                    }
                    tmp[i].onfocus      = function() { this.blur(); };
                    tmp[i].setAttribute("rel", tmp.length-i-1);
                }
            }
        }
    };
    this.autoslide_allow    = function() {
        this.autoslide_forbid();
        var obj = this;
        this.tmp.autoslide_tm   = setTimeout( function() { obj.show_next2() }, 4000 );
    };
    this.autoslide_forbid   = function() {
        if( this.tmp.autoslide_tm ) {
            clearTimeout(this.tmp.autoslide_tm);
        }
    };
}



function buydeal_choose_variant(for_present) {
    var box = d.getElementById("priceoptions");
    if( ! box ) { return; }
    try {
        var i, a = box.getElementsByTagName("A");
        for(i=0; i<a.length; i++) {
            if( a[i].href.match("javascript") ) {
                continue;
            }
            if( for_present && !a[i].href.match("for:present") ) {
                a[i].href   = a[i].href+"/for:present";
            }
            else if( !for_present && a[i].href.match("for:present") ) {
                a[i].href   = a[i].href.replace("/for:present", "");
            }
        }
    } catch(e) {
    }
    try {
        var ar  = d.getElementById("po_chofka");
        if( for_present ) {
            ar.style.top    = "25px";
            window.buydeal_forpresent = true;
        }
        else {
            ar.style.top    = "7px";
            window.buydeal_forpresent = false;
        }
    } catch(e) {
    }
    try {
        var nvp_panel = $('#nvp_buypanel');
        var nvp_pricetag = $('#nvp_pricetag');
        var offset_top = nvp_pricetag.offset().top - nvp_panel.offset().top + 16 + 'px';
        var bialo_height = $('#nvp_pricetag_bialo').height() + 20;
            
        if( for_present ) {
            box.style.top   = "150px";
            box.style.left  = "205px";
            box.style.position  = "absolute";
        }
        else {
            var tmp = $('#nvp_pricetag').css('position');
            if(tmp == 'fixed'){
                $('#priceoptions').css('position','fixed');
                var left = $('#nvp_pricetag').offset().left + 223 - 18;
                $('#priceoptions').css('top',16 + bialo_height +'px');
                $('#priceoptions').css('left',left+'px');
            } else {
                $('#priceoptions').css('position','absolute');
                $('#priceoptions').css('top',offset_top);
                $('#priceoptions').css('left','205px');
            }   
        }
    }
    catch(e) {
    }
    var nav = get_nav();
    if( nav.is_msie && nav.ver<=7 ) {
        box.style.display   = "block";
    }
    else {
        box.style.display   = "block";
        blackoverlay( ({close_allowed:true, close_callback:function(){box.style.display="none";}, content_object:box}) );
    }
}
function buydealpage_choose_variant() {
    var box = d.getElementById("priceoptions");
    if( ! box ) { return; }
    box.style.left  = "163px";
    box.style.top   = "-5px";
    var nav = get_nav();
    if( nav.is_msie && nav.ver<=7 ) {
        box.style.display   = "block";
    }
    else {
        box.style.display   = "block";
        blackoverlay( ({close_allowed:true, close_callback:function(){box.style.display="none";}, content_object:box}) );
    }
}
function buydeal_choose_variant_close() {
    var box = d.getElementById("priceoptions");
    if( ! box ) { return; }
    box.style.display   = "none";
    blackoverlay_close();
}


var side_deals_clocks   = {};
function start_side_deals_clocks() {
    var start_sd_clock  = function(c, t) {
        var ch, cm, cs, h, m, s;
        t   = parseInt(t, 10);
        if( !t ) { t = 0; }
        ch  = d.getElementById("sdl"+c+"_h");
        cm  = d.getElementById("sdl"+c+"_m");
        cs  = d.getElementById("sdl"+c+"_s");
        if( !ch || !cm || !cs ) { return; }
        if( t < 0 ) { return; }
        setInterval( function() {
            t   --;
            if( t < 0 ) { t = 0; }
            s   = t;
            h   = Math.floor(s / 3600);
            s   -= h * 3600;
            //h = Math.min(h, 99);
            m   = Math.floor(s / 60);
            s   -= m * 60;
            h   += "";
            m   += "";
            s   += "";
            if( h < 10 ) { h = "0" + h; }
            if( m < 10 ) { m = "0" + m; }
            if( s < 10 ) { s = "0" + s; }
            ch.innerHTML    = h;
            cm.innerHTML    = m;
            cs.innerHTML    = s;
        }, 1000 );
    };
    setTimeout( function() {
        for(var c in side_deals_clocks) {
            start_sd_clock(c, side_deals_clocks[c]);
        }
        var nav = get_nav();
        if( nav.is_msie && nav.ver<=7 ) {
            var cnt = d.getElementById("newsidedeals");
            var divs    = d.getElementsByTagName("DIV");
            var j   = 50;
            for(var i=0; i<divs.length; i++) {
                if( ! divs[i].className.match(/^nsd/) ) { continue; }
                divs[i].style.zIndex    = --j;
                if( nav.ver <= 6 ) {
                    divs[i].onmouseover = function() { obj_class_add(this, "iehovered"); };
                    divs[i].onmouseout  = function() { obj_class_del(this, "iehovered"); };
                }
            }
        }
    }, 50);
}

function get_nav()
{
    var nav = {};
    nav.is_firefox  = false;
    nav.is_chrome   = false;
    nav.is_safari   = false;
    nav.is_opera    = false;
    nav.is_msie     = false;
    nav.ver = 0;
    var ua  = navigator.userAgent.toLowerCase();
    var tmp;
    tmp = ua.match(/firefox\/([0-9]+\.[0-9]+)/);
    if( tmp ) {
        nav.is_firefox  = true;
        nav.ver = parseFloat(tmp[1]);
        return nav;
    }
    tmp = ua.match(/chrome\/([0-9]+\.[0-9]+)/);
    if( tmp ) {
        nav.is_chrome   = true;
        nav.ver = parseFloat(tmp[1]);
        return nav;
    }
    tmp = ua.match(/msie\s([0-9]+\.[0-9]+)/);
    if( tmp ) {
        nav.is_msie = true;
        nav.ver = parseFloat(tmp[1]);
        return nav;
    }
    tmp = ua.match(/opera/);
    if( tmp ) {
        nav.is_opera    = true;
        tmp = ua.match(/version\/([0-9]+\.[0-9]+)/);
        if( tmp ) {
            nav.ver = parseFloat(tmp[1]);
        }
        return nav;
    }
    tmp = ua.match(/safari/);
    if( tmp ) {
        nav.is_safari   = true;
        tmp = ua.match(/version\/([0-9]+\.[0-9]+)/);
        if( tmp ) {
            nav.ver = parseFloat(tmp[1]);
        }
        return nav;
    }
    return nav;
}

function get_time()
{
    return parseInt( new Date().getTime().toString().substr(0, 10), 10 );
}

function get_time_ms()
{
    return new Date().getTime();
}
